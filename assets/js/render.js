(function () {
  const R = {};
  let dbDefaultValues = {};

  R.escape = function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  R.formatNumber = function (num) {
    if (typeof num === "number") {
      return num.toLocaleString('en-US');
    }
    return num;
  };

  R.badge = function (value) {
    const v = String(value).toLowerCase();
    const map = {
      high: "badge-high",
      medium: "badge-medium",
      low: "badge-low",
      draft: "badge-draft",
      approved: "badge-approved"
    };
    const labels = {
      high: "مرتفع",
      medium: "متوسط",
      low: "منخفض",
      draft: "مسودة",
      approved: "معتمد"
    };
    return '<span class="badge ' + (map[v] || "badge-draft") + '">' + (labels[v] || R.escape(value)) + "</span>";
  };

  R.value = function (value, key) {
    if (value === null || value === undefined || value === "") return '<span class="null">غير محدد</span>';
    if (typeof value === "boolean") return value ? '<span class="bool-true">✓ نعم</span>' : '<span class="bool-false">✗ لا</span>';
    if (["priority", "status", "probability", "impact"].includes(key)) return R.badge(value);

    if (Array.isArray(value)) {
      if (value.length === 0) return '<span class="null">لا يوجد</span>';
      return '<ul class="data-list">' + value.map(v => "<li>" + R.value(v) + "</li>").join("") + "</ul>";
    }

    if (typeof value === "object") {
      return '<div class="nested">' + Object.entries(value).map(([k, v]) =>
        '<div class="row"><span class="key">' + labelOf(k) + '</span><span class="val">' + R.value(v, k) + "</span></div>"
      ).join("") + "</div>";
    }

    // Format money/currency values
    if (typeof value === "number" && (key.includes("cost") || key.includes("budget") || key.includes("estimate"))) {
      return '<b class="currency-val">' + R.formatNumber(value) + ' <small>SAR (ريال سعودي)</small></b>';
    }

    if (typeof value === "number") {
      return R.formatNumber(value);
    }

    return R.escape(value);
  };

  R.renderAll = function (data, target) {
    let html = "";

    // Store DB defaults for ROI Calculator (Task 3)
    dbDefaultValues = {
      area: data.requirements?.led?.area_m2 || data.location?.facade_area_m2 || 680,
      costMin: data.financials?.led_cost_per_m2?.min || 3200,
      costMax: data.financials?.led_cost_per_m2?.max || 4800,
      annualOpCost: data.financials?.annual_operating_cost || 235008,
      annualRevenue: 2600000
    };

    // Quick Section Navigation Bar
    html += '<div class="section-nav-bar">';
    Object.keys(data).forEach(k => {
      if (k === 'attachments' || k === 'portfolio_demos') return;
      html += `<a href="#sec_${k}" class="nav-chip">${labelOf(k)}</a>`;
    });
    html += '</div>';

    // Render Cards
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'portfolio_demos') return; // Handled in 3D module
      html += `<section class="card" id="sec_${k}">
        <h2>${labelOf(k)}</h2>
        ${R.value(v, k)}
      </section>`;
    });

    // Add Interactive Financial & ROI Estimator Widget inside Financials area
    if (data.financials) {
      html += `
        <section class="card roi-card" id="interactiveRoi">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <h2>📊 حاسبة الجدوى المالية واسترداد الاستثمار (ROI Calculator)</h2>
            <button type="button" class="small-btn" onclick="window.resetRoiDefaults()" style="background: #1e293b; border: 1px solid var(--accent); color: var(--accent);">
              ↺ استعادة القيم الافتراضية من المشروع (DB)
            </button>
          </div>
          <p style="color: var(--muted); font-size: 0.9rem; margin-top: 6px;">مربوطة تلقائياً ببيانات قاعدة البيانات لجدول Financials و Requirements:</p>

          <div class="roi-controls">
            <div class="form-group">
              <label>مساحة الشاشة (م²):</label>
              <input type="number" id="calcArea" value="${dbDefaultValues.area}" min="50" max="3000" oninput="window.calcRoi()">
            </div>
            <div class="form-group">
              <label>تكلفة المتر المربع الأدنى (ريال):</label>
              <input type="number" id="calcCostPerM2" value="${dbDefaultValues.costMin}" min="1000" max="10000" oninput="window.calcRoi()">
            </div>
            <div class="form-group">
              <label>تكلفة التشغيل السنوية المعتمدة (ريال):</label>
              <input type="number" id="calcAnnualOpCost" value="${dbDefaultValues.annualOpCost}" min="10000" max="1000000" oninput="window.calcRoi()">
            </div>
            <div class="form-group">
              <label>العائد الإعلاني السنوي التقديري (ريال):</label>
              <input type="number" id="calcAnnualRevenue" value="${dbDefaultValues.annualRevenue}" min="100000" max="10000000" oninput="window.calcRoi()">
            </div>
          </div>

          <div class="roi-results-grid">
            <div class="roi-res-box">
              <span class="lbl">التكلفة الإجمالية التقديرية للشاشات</span>
              <span class="val" id="resLedCost">0</span> SAR
            </div>
            <div class="roi-res-box">
              <span class="lbl">تكلفة التركيب والهيكل (15%)</span>
              <span class="val" id="resInstallCost">0</span> SAR
            </div>
            <div class="roi-res-box highlight">
              <span class="lbl">فترة استرداد الاستثمار المتوقعة (ROI)</span>
              <span class="val" id="resRoiMonths">0</span> شهر
            </div>
          </div>
        </section>
      `;
    }

    target.innerHTML = html;

    // Trigger ROI Calculation after DOM update
    setTimeout(() => { if (window.calcRoi) window.calcRoi(); }, 100);
  };

  window.calcRoi = function () {
    const area = parseFloat(document.getElementById("calcArea")?.value || dbDefaultValues.area || 680);
    const costPerM2 = parseFloat(document.getElementById("calcCostPerM2")?.value || dbDefaultValues.costMin || 3200);
    const annualOpCost = parseFloat(document.getElementById("calcAnnualOpCost")?.value || dbDefaultValues.annualOpCost || 235008);
    const annualRev = parseFloat(document.getElementById("calcAnnualRevenue")?.value || 2600000);

    const ledCost = area * costPerM2;
    const installCost = ledCost * 0.15; // ~15% installation
    const totalCapEx = ledCost + installCost;

    const netAnnualIncome = annualRev - annualOpCost;
    const roiYears = netAnnualIncome > 0 ? (totalCapEx / netAnnualIncome) : 0;
    const roiMonths = Math.round(roiYears * 12);

    if (document.getElementById("resLedCost")) {
      document.getElementById("resLedCost").textContent = Math.round(ledCost).toLocaleString();
      document.getElementById("resInstallCost").textContent = Math.round(installCost).toLocaleString();
      document.getElementById("resRoiMonths").textContent = roiMonths > 0 ? roiMonths : 'N/A';
    }
  };

  window.resetRoiDefaults = function () {
    if (document.getElementById("calcArea")) document.getElementById("calcArea").value = dbDefaultValues.area;
    if (document.getElementById("calcCostPerM2")) document.getElementById("calcCostPerM2").value = dbDefaultValues.costMin;
    if (document.getElementById("calcAnnualOpCost")) document.getElementById("calcAnnualOpCost").value = dbDefaultValues.annualOpCost;
    if (document.getElementById("calcAnnualRevenue")) document.getElementById("calcAnnualRevenue").value = dbDefaultValues.annualRevenue;
    window.calcRoi();
  };

  window.Renderer = R;
})();