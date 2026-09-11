/**
 * Direct PDF Export Utility for SkillSync Maharashtra
 * Generates and downloads high-resolution PDF directly without opening print dialogs
 */
import html2pdf from 'html2pdf.js';

export async function downloadElementAsPdf(elementId, filename = 'Maharashtra_Technical_Curriculum_Dossier.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF generation.`);
    return false;
  }

  // Clone element to safely render without affecting page view or causing flicker
  const clone = element.cloneNode(true);
  clone.id = `${elementId}-export-clone`;
  clone.style.position = 'fixed';
  clone.style.top = '0px';
  clone.style.left = '0px';
  clone.style.width = '980px';
  clone.style.zIndex = '-9999';
  clone.style.opacity = '1';
  clone.style.display = 'block';
  clone.style.pointerEvents = 'none';
  clone.classList.remove('print-only');

  // Ensure any print-only children are rendered visible
  const printOnlyChildren = clone.querySelectorAll('.print-only');
  printOnlyChildren.forEach(el => {
    el.classList.remove('print-only');
    el.style.display = 'block';
  });

  document.body.appendChild(clone);

  const opt = {
    margin: [8, 8, 8, 8], // mm
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      letterRendering: true,
      windowWidth: 980
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await html2pdf().set(opt).from(clone).save();
    return true;
  } catch (err) {
    console.error('Direct PDF export error:', err);
    throw err;
  } finally {
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  }
}
