import { jsPDF } from 'jspdf';
import { Project } from '../types';

const DB_NAME = 'velora_files_db';
const STORE_NAME = 'project_brochures';
const DB_VERSION = 1;

interface StoredBrochureRecord {
  projectId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileSizeFormatted: string;
  uploadDate: string;
  blob: Blob;
  dataUrl?: string;
}

/**
 * Open or create IndexedDB for large binary file persistence (PDFs up to 100MB+)
 */
function openFilesDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported in this browser'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'projectId' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const BrochureService = {
  /**
   * Save a brochure file uploaded from the computer to IndexedDB
   */
  saveBrochureFile: async (
    projectId: string,
    file: File
  ): Promise<{
    fileName: string;
    fileSizeFormatted: string;
    uploadDate: string;
    dataUrl?: string;
  }> => {
    const db = await openFilesDB();
    const uploadDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const fileSizeFormatted = formatFileSize(file.size);

    // If small enough (< 1.5MB), also generate a base64 dataUrl as secondary fallback
    let dataUrl: string | undefined = undefined;
    if (file.size <= 1.5 * 1024 * 1024) {
      try {
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } catch {
        // Fallback silently if base64 conversion fails; binary blob in IndexedDB will be used
      }
    }

    const record: StoredBrochureRecord = {
      projectId,
      fileName: file.name,
      fileType: file.type || 'application/pdf',
      fileSize: file.size,
      fileSizeFormatted,
      uploadDate,
      blob: file,
      dataUrl,
    };

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    return {
      fileName: file.name,
      fileSizeFormatted,
      uploadDate,
      dataUrl,
    };
  },

  /**
   * Retrieve brochure blob for a project from IndexedDB
   */
  getBrochureRecord: async (projectId: string): Promise<StoredBrochureRecord | null> => {
    try {
      const db = await openFilesDB();
      return await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(projectId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  /**
   * Delete a brochure from IndexedDB
   */
  deleteBrochureFile: async (projectId: string): Promise<void> => {
    try {
      const db = await openFilesDB();
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(projectId);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    } catch {
      // Ignored
    }
  },

  /**
   * Generate an official, branded luxury project brochure PDF on the fly using jsPDF
   */
  generateOfficialBrochurePdf: async (
    project: Project
  ): Promise<{
    fileName: string;
    fileSizeFormatted: string;
    uploadDate: string;
    dataUrl: string;
  }> => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;

    // Header banner (Velora Emerald)
    doc.setFillColor(0, 41, 30); // #00291E
    doc.rect(0, 0, pageWidth, 42, 'F');

    // Gold Accent bar
    doc.setFillColor(201, 162, 74); // #C9A24A
    doc.rect(0, 42, pageWidth, 3, 'F');

    // Brand Title
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('VELORA DEVELOPERS', margin, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(201, 162, 74);
    doc.text('TURNING LAND INTO LANDMARKS  •  ESTATE & PLOTTED DEVELOPMENTS', margin, 25);

    // Official Document Tag
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('OFFICIAL PROJECT BROCHURE & MASTER LAYOUT SPECIFICATIONS', margin, 34);

    let curY = 56;

    // Project Name & Location
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(0, 41, 30);
    const titleText = `${project.name} ${project.marathiName ? `(${project.marathiName})` : ''}`;
    doc.text(titleText, margin, curY);

    curY += 7;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`"${project.tagline || 'Nature Living. Modern Luxury.'}"`, margin, curY);

    curY += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 60);
    doc.text(`Prime Location: ${project.location}  •  Total Plots: ${project.totalPlots || 42} Units`, margin, curY);

    curY += 10;
    doc.setDrawColor(201, 162, 74);
    doc.setLineWidth(0.5);
    doc.line(margin, curY, margin + contentWidth, curY);

    curY += 8;

    // Executive Summary Box
    doc.setFillColor(248, 240, 216); // light warm gold tint
    doc.roundedRect(margin, curY, contentWidth, 26, 2, 2, 'F');

    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 41, 30);
    doc.text('EXECUTIVE OVERVIEW', margin + 6, curY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    const descLines = doc.splitTextToSize(
      project.longDescription ||
        `${project.name} is an exclusive gated community of Collector Approved NA residential plots designed for scenic country homes, weekend villas, and high-return land investments.`,
      contentWidth - 12
    );
    doc.text(descLines.slice(0, 3), margin + 6, curY + 13);

    curY += 34;

    // Specifications Grid (4 columns)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(201, 162, 74);
    doc.text('KEY PROJECT SPECIFICATIONS', margin, curY);

    curY += 5;
    const colWidth = contentWidth / 4;
    const specs = [
      { label: 'PLOT SIZES', val: project.plotSizes || '1,000 - 3,500 Sq.Ft.' },
      { label: 'APPROVAL STATUS', val: project.sanctionApproval || 'Collector NA Sanctioned' },
      { label: 'TITLE & 7/12', val: project.titleRegistration || 'Individual 7/12 Transfer' },
      { label: 'POSSESSION', val: project.possessionStatus || 'Immediate Possession' },
    ];

    specs.forEach((s, idx) => {
      const x = margin + idx * colWidth;
      doc.setFillColor(245, 247, 246);
      doc.roundedRect(x, curY, colWidth - 2, 18, 1.5, 1.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(s.label, x + 3, curY + 6);

      doc.setFont('times', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(0, 41, 30);
      const valLines = doc.splitTextToSize(s.val, colWidth - 6);
      doc.text(valLines[0] || '', x + 3, curY + 12);
    });

    curY += 26;

    // Highlights & Infrastructure Sections (2 columns)
    const halfWidth = (contentWidth - 6) / 2;

    // Left Column: Key Highlights
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0, 41, 30);
    doc.text('PROJECT HIGHLIGHTS', margin, curY);

    curY += 5;
    const leftY = curY;
    const highlights = project.keyHighlights?.length
      ? project.keyHighlights.slice(0, 6)
      : [
          'Collector Approved NA Plotted Layout',
          'Separate 7/12 Extract for Every Plot',
          'Immediate Possession Ready',
          'Clear Title & 100% Legal Transparency',
          'Bank Loan Support from Leading Institutions',
          'Secured Gated Boundary with Security Post',
        ];

    let itemY = leftY;
    highlights.forEach((h) => {
      doc.setFillColor(201, 162, 74);
      doc.circle(margin + 2, itemY - 1, 1, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      const lines = doc.splitTextToSize(h, halfWidth - 8);
      doc.text(lines[0] || '', margin + 6, itemY);
      itemY += 6;
    });

    // Right Column: Master Layout & Infrastructure
    const rightX = margin + halfWidth + 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0, 41, 30);
    doc.text('PLANNED INFRASTRUCTURE', rightX, curY);

    let rightItemY = curY + 5;
    const infra = project.masterPlanFeatures?.length
      ? project.masterPlanFeatures.slice(0, 6)
      : [
          '30ft Wide Main Internal Roads & Arterials',
          'Individual Water Connection to Each Plot',
          'Underground Electricity Line with Transformer',
          'Modern Street Lighting Throughout Layout',
          'Designer Landscaped Gardens & Gazebos',
          'Central Clubhouse & Children Play Area',
        ];

    infra.forEach((inf) => {
      doc.setFillColor(0, 41, 30);
      doc.circle(rightX + 2, rightItemY - 1, 1, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      const lines = doc.splitTextToSize(inf, halfWidth - 8);
      doc.text(lines[0] || '', rightX + 6, rightItemY);
      rightItemY += 6;
    });

    curY = Math.max(itemY, rightItemY) + 6;

    // Location Highlights & Distances
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0, 41, 30);
    doc.text('STRATEGIC CONNECTIVITY & LOCATION HIGHLIGHTS', margin, curY);

    curY += 5;
    const locBenefits = project.locationBenefits?.length
      ? project.locationBenefits.slice(0, 5)
      : [
          'Prime connectivity via national & state expressways',
          'Nearby railway transit & direct highway access',
          '10 mins to multi-speciality medical centres',
          'Reputed educational schools & colleges in close proximity',
          'Peaceful pollution-free green surroundings with mountain backdrop',
        ];

    locBenefits.forEach((b) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(201, 162, 74);
      doc.text('✓', margin + 2, curY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      doc.text(b, margin + 8, curY);
      curY += 5.5;
    });

    curY += 4;

    // Contact & Private Site Visit Box (Velora Emerald)
    doc.setFillColor(0, 41, 30);
    doc.roundedRect(margin, curY, contentWidth, 24, 2, 2, 'F');

    doc.setFont('times', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(201, 162, 74);
    doc.text('SCHEDULE A PRIVATE SITE VISIT & PLOT RESERVATION', margin + 6, curY + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(
      'Complimentary AC chauffeur-driven site visit arranged from Pune & Solapur. Experience the land firsthand.',
      margin + 6,
      curY + 12
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(201, 162, 74);
    doc.text(
      'Helpline: +91 91583 83808  •  WhatsApp: +91 91583 83808  •  Web: www.veloradevelopers.com',
      margin + 6,
      curY + 18.5
    );

    // Footer with RERA & Legal Disclaimer
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(140, 140, 140);
    const reraInfo = project.reraNumber ? `RERA No: ${project.reraNumber}  •  ` : '';
    doc.text(
      `${reraInfo}Velora Developers. All plots subject to availability. Information provided for illustration. Separate 7/12 extract on registry.`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );

    // Generate output
    const pdfBlob = doc.output('blob');
    const fileName = `Velora_${project.name.replace(/\s+/g, '_')}_Brochure.pdf`;
    const fileSizeFormatted = formatFileSize(pdfBlob.size);
    const uploadDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const dataUrl = doc.output('datauristring');

    // Save to IndexedDB so it's instantly available as the project's brochure file
    const db = await openFilesDB();
    const record: StoredBrochureRecord = {
      projectId: project.id,
      fileName,
      fileType: 'application/pdf',
      fileSize: pdfBlob.size,
      fileSizeFormatted,
      uploadDate,
      blob: pdfBlob,
      dataUrl,
    };

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    return {
      fileName,
      fileSizeFormatted,
      uploadDate,
      dataUrl,
    };
  },

  /**
   * Universal customer download function:
   * Triggers download of the uploaded brochure from the computer,
   * or fallback URL, or generates official PDF if none uploaded yet.
   */
  downloadProjectBrochure: async (
    project: Project
  ): Promise<{ success: boolean; message: string; fileName: string }> => {
    // 1. Check IndexedDB for the file uploaded from the computer
    const record = await BrochureService.getBrochureRecord(project.id);
    if (record && record.blob) {
      const objectUrl = URL.createObjectURL(record.blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = record.fileName || `Velora_${project.name}_Brochure.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);

      return {
        success: true,
        message: `Downloading ${record.fileName} (${record.fileSizeFormatted})...`,
        fileName: record.fileName,
      };
    }

    // 2. Check dataUrl or project.brochurePdfUrl or project.masterPlanPdfUrl
    const url = project.brochurePdfUrl || project.masterPlanPdfUrl;
    if (url) {
      if (url.startsWith('data:') || url.startsWith('blob:')) {
        const a = document.createElement('a');
        a.href = url;
        a.download =
          project.brochureFileName ||
          project.masterPlanPdfFileName ||
          `Velora_${project.name}_Brochure.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return {
          success: true,
          message: `Downloading ${a.download}...`,
          fileName: a.download,
        };
      } else {
        // External link or URL
        window.open(url, '_blank', 'noopener,noreferrer');
        return {
          success: true,
          message: 'Opening brochure in new tab...',
          fileName: 'Brochure PDF',
        };
      }
    }

    // 3. If no brochure uploaded yet, generate official PDF dynamically on the fly
    const gen = await BrochureService.generateOfficialBrochurePdf(project);
    const genRecord = await BrochureService.getBrochureRecord(project.id);
    if (genRecord && genRecord.blob) {
      const objectUrl = URL.createObjectURL(genRecord.blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = gen.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);

      return {
        success: true,
        message: `Downloaded official ${project.name} brochure (${gen.fileSizeFormatted})!`,
        fileName: gen.fileName,
      };
    }

    return {
      success: false,
      message: 'Brochure is not available for this project yet.',
      fileName: '',
    };
  },
};
