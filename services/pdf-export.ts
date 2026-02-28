/**
 * PDF Export Service
 *
 * Generates a printable portrait report.
 * - Web:    opens browser print dialog via a new window
 * - Native: uses expo-print → expo-sharing (future)
 */

import { Platform } from 'react-native';
import { generatePortraitHTML } from '@/utils/portrait/pdf-template';
import { generateCouplePortraitHTML } from '@/utils/portrait/couple-pdf-template';
import type { IndividualPortrait } from '@/types/portrait';
import type { DeepCouplePortrait } from '@/types/couples';

/**
 * Generate and present a portrait PDF.
 *
 * On web this opens a print-ready window (user can Save As PDF).
 * On native it will use expo-print + expo-sharing when available.
 */
export async function generatePortraitPDF(portrait: IndividualPortrait, userName?: string): Promise<void> {
  const html = generatePortraitHTML(portrait, userName);

  if (Platform.OS === 'web') {
    // Web — open a print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      // Small delay so the content renders before print dialog
      setTimeout(() => {
        printWindow.print();
      }, 400);
    } else {
      // Popup blocked — fallback to inline print
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
        setTimeout(() => {
          iframe.contentWindow?.print();
          setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 400);
      }
    }
    return;
  }

  // Native — use expo-print + expo-sharing
  try {
    const Print = await import('expo-print');
    const Sharing = await import('expo-sharing');

    const { uri } = await Print.printToFileAsync({ html });

    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Portrait Report',
        UTI: 'com.adobe.pdf',
      });
    } else {
      // Fallback — just print directly
      await Print.printAsync({ html });
    }
  } catch (err) {
    // Fallback — direct print
    try {
      const Print = await import('expo-print');
      await Print.printAsync({ html });
    } catch {
      if (__DEV__) console.warn('[PDF] Export failed:', err);
      throw new Error('Unable to generate PDF. Please try again.');
    }
  }
}

/**
 * Generate and present a couple portrait PDF.
 *
 * On web this opens a print-ready window (user can Save As PDF).
 * On native it will use expo-print + expo-sharing when available.
 */
export async function generateCouplePortraitPDF(
  portrait: DeepCouplePortrait,
  partnerAName?: string,
  partnerBName?: string,
): Promise<void> {
  const html = generateCouplePortraitHTML(portrait, partnerAName, partnerBName);

  if (Platform.OS === 'web') {
    // Web — open a print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      // Small delay so the content renders before print dialog
      setTimeout(() => {
        printWindow.print();
      }, 400);
    } else {
      // Popup blocked — fallback to inline print
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
        setTimeout(() => {
          iframe.contentWindow?.print();
          setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 400);
      }
    }
    return;
  }

  // Native — use expo-print + expo-sharing
  try {
    const Print = await import('expo-print');
    const Sharing = await import('expo-sharing');

    const { uri } = await Print.printToFileAsync({ html });

    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Couple Portrait Report',
        UTI: 'com.adobe.pdf',
      });
    } else {
      // Fallback — just print directly
      await Print.printAsync({ html });
    }
  } catch (err) {
    // Fallback — direct print
    try {
      const Print = await import('expo-print');
      await Print.printAsync({ html });
    } catch {
      if (__DEV__) console.warn('[PDF] Couple export failed:', err);
      throw new Error('Unable to generate PDF. Please try again.');
    }
  }
}
