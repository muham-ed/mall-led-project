/**
 * Arabic PDF Export Engine for Mall LED Facade Project
 * Uses jsPDF and html2canvas to generate formal project reports with 3D Canvas Snapshot
 */

async function exportProjectPDF() {
  const statusEl = document.getElementById("status");
  const showStatus = (msg, type) => {
    if (statusEl) {
      statusEl.textContent = msg;
      statusEl.className = "status show " + type;
      if (type === "ok") setTimeout(() => statusEl.classList.remove("show"), 3000);
    }
  };

  try {
    showStatus("جاري تحضير وإنشاء تقرير PDF الخاص بالمشروع...", "info");

    const appEl = document.getElementById("app");
    if (!appEl) throw new Error("عنصر البيانات غير موجود");

    // Capture 3D Canvas
    let canvasImgData = null;
    if (window.Facade3D && Facade3D.getCanvas) {
      const c = Facade3D.getCanvas();
      if (c) {
        canvasImgData = c.toDataURL("image/png");
      }
    }

    // Capture app element to Canvas using html2canvas
    const capturedCanvas = await html2canvas(document.body, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: "#0f172a"
    });

    const imgData = capturedCanvas.toDataURL("image/jpeg", 0.85);

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const filename = (window.projectData?.meta?.project_id || "MALL-LED-001") + "-Report.pdf";
    pdf.save(filename);

    showStatus("✅ تم تصدير تقرير PDF بنجاح", "ok");
  } catch (e) {
    console.error(e);
    showStatus("❌ فشل تصدير PDF: " + e.message, "err");
  }
}

window.exportProjectPDF = exportProjectPDF;