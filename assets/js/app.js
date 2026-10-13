const statusEl = document.getElementById("status");
const appEl = document.getElementById("app");
const rawEl = document.getElementById("raw");
let projectData = null;

function showStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = "status show " + type;
  if (type === "ok") setTimeout(() => statusEl.classList.remove("show"), 2500);
}

async function loadProject() {
  try {
    showStatus("جاري التحميل...", "info");
    const res = await fetch("api/load.php", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    projectData = data;
    window.projectData = data;

    document.getElementById("pageTitle").textContent = data.meta?.title_ar || "مشروع واجهة مول LED";
    document.getElementById("pageSub").textContent = (data.meta?.project_id || "") + " — " + (data.meta?.status === 'approved' ? 'معتمد' : 'مسودة');

    // Initialize 3D Facade Interactive Simulator (Three.js WebGL)
    if (window.Facade3D) {
      Facade3D.init("facade3dContainer", data);
    }

    Renderer.renderAll(data, appEl);
    rawEl.textContent = JSON.stringify(data, null, 2);
    showStatus("تم تحميل البيانات وتفعيل العرض 3D بـ Three.js بنجاح", "ok");
  } catch (e) {
    showStatus("ملاحظة: تم استخدام الوضع التفاعلي المباشر (" + e.message + ")", "info");
    if (window.Facade3D) {
      Facade3D.init("facade3dContainer", null);
    }
  }
}

function copyJSON() {
  if (!projectData) return;
  navigator.clipboard.writeText(JSON.stringify(projectData, null, 2)).then(() => showStatus("تم نسخ JSON إلى الحافظة", "ok"));
}

function downloadJSON() {
  if (!projectData) return;
  const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (projectData.meta?.project_id || "project") + ".json";
  a.click();
  URL.revokeObjectURL(url);
}

function toggleRaw() {
  rawEl.style.display = rawEl.style.display === "none" ? "block" : "none";
}

loadProject();