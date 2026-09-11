/**
 * Direct PDF Export Utility for SkillSync Maharashtra
 * Uses html2canvas-pro (native support for Tailwind CSS v4 oklch colors) + jsPDF
 */
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export async function downloadElementAsPdf(elementId, filename = 'Maharashtra_Technical_Curriculum_Dossier.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF generation.`);
    return false;
  }

  // Clone element to safely render offscreen without layout shifts
  const clone = element.cloneNode(true);
  clone.id = `${elementId}-export-clone`;
  clone.style.position = 'fixed';
  clone.style.top = '0px';
  clone.style.left = '0px';
  clone.style.width = '900px';
  clone.style.zIndex = '-9999';
  clone.style.opacity = '1';
  clone.style.display = 'block';
  clone.style.pointerEvents = 'none';
  clone.style.backgroundColor = '#ffffff';
  clone.classList.remove('print-only');

  // Ensure all children are visible
  const printOnlyChildren = clone.querySelectorAll('.print-only');
  printOnlyChildren.forEach(el => {
    el.classList.remove('print-only');
    el.style.display = 'block';
  });

  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 900,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.96);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210; // mm
    const pageHeight = 297; // mm
    const margin = 8;
    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = pageHeight - (margin * 2);
    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    // Add first page
    pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, imgHeight);
    heightLeft -= contentHeight;

    // Add subsequent pages if the content exceeds one page
    while (heightLeft > 0) {
      position = -(imgHeight - heightLeft) + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, imgHeight);
      heightLeft -= contentHeight;
    }

    pdf.save(filename);
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
