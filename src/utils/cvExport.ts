import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

/**
 * Formats a clean, safe, cross-platform filename for the CV PDF export.
 * Example: "SEMAKO Déo-Gratias" -> "CV-SEMAKO-Deo-Gratias.pdf"
 */
export function formatCvFileName(rawName?: string): string {
  if (!rawName || !rawName.trim()) {
    return 'CV-SEMAKO-Deo-Gratias.pdf';
  }

  const clean = rawName
    .trim()
    // Normalize diacritics / accents (e.g. é -> e, à -> a, ô -> o)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces and special characters with a hyphen
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    // Collapse consecutive hyphens
    .replace(/-+/g, '-')
    // Trim hyphens from edges
    .replace(/^-+|-+$/g, '');

  return `CV-${clean || 'SEMAKO-Deo-Gratias'}.pdf`;
}

export interface PdfExportResult {
  success: boolean;
  fileName: string;
  error?: string;
  blobUrl?: string;
  usedFallback?: boolean;
}

/**
 * Generates and triggers automatic download of the CV as a high-definition PDF file.
 * Handles desktop, Android, iOS Safari, Chrome, and modern mobile browsers.
 */
export async function downloadCvPdf(
  element: HTMLElement,
  rawName: string,
  onProgress?: (step: string) => void
): Promise<PdfExportResult> {
  const fileName = formatCvFileName(rawName);

  try {
    onProgress?.('Préparation du document haute définition...');

    // Wait for fonts if supported
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch {
        // Continue if fonts check is not supported
      }
    }

    // Clone element to standard A4 desktop width (800px) so the layout is always pristine
    // even on narrow mobile or Android screens
    const clone = element.cloneNode(true) as HTMLElement;
    clone.id = 'printable-cv-clone-for-pdf';
    clone.style.position = 'fixed';
    clone.style.top = '-9999px';
    clone.style.left = '0';
    clone.style.width = '800px';
    clone.style.maxWidth = '800px';
    clone.style.minWidth = '800px';
    clone.style.margin = '0';
    clone.style.padding = '32px 36px';
    clone.style.background = '#ffffff';
    clone.style.color = '#0f172a';
    clone.style.boxSizing = 'border-box';
    clone.style.zIndex = '-9999';
    clone.classList.remove('overflow-y-auto', 'max-h-[92vh]');
    clone.style.overflow = 'visible';
    clone.style.height = 'auto';

    document.body.appendChild(clone);

    let canvas: HTMLCanvasElement;
    try {
      // Wait a brief moment for images to be ready in the clone
      await new Promise((resolve) => setTimeout(resolve, 80));

      onProgress?.('Rendu vectoriel et capture HD...');

      // Render HD canvas at scale: 2 (crisp print-grade resolution)
      canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
      });
    } finally {
      // Cleanup clone
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
    }

    onProgress?.('Assemblage et compression du fichier PDF...');

    const imgData = canvas.toDataURL('image/jpeg', 0.96);

    // Standard A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Additional pages if needed
    while (heightLeft > 5) {
      position = -(imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    onProgress?.('Téléchargement automatique...');

    // Generate blob and trigger automatic download
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);

    // Create anchor link to trigger native browser download (compatible with desktop, Android, iOS Safari)
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      try {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      } catch {
        // Safe ignore
      }
    }, 2000);

    return {
      success: true,
      fileName,
      blobUrl,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la création du PDF';
    console.warn('Génération PDF directe indisponible, bascule sur impression système:', err);

    return {
      success: false,
      fileName,
      error: errorMsg,
      usedFallback: true,
    };
  }
}
