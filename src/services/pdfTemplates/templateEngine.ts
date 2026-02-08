// src/services/pdfTemplates/templateEngine.ts
import type { PdfTemplateId, PdfTemplateContext } from '../../types/pdfTemplate';
import { classicTemplate } from './classic';
import { modernTemplate } from './modern';
import { minimalTemplate } from './minimal';

/**
 * Generate PDF HTML using specified template
 *
 * @param templateId - Template style to use
 * @param context - Complete context with all data needed for PDF
 * @returns Complete HTML string ready for expo-print
 *
 * @example
 * const html = generatePdfHtml('modern', {
 *   business: profile,
 *   client: clientData,
 *   document: docMetadata,
 *   lineItems: items,
 *   calculations: totals,
 *   tax: taxConfig,
 *   currency: currencyConfig,
 *   translations: t18nKeys,
 *   logoBase64: logo,
 *   primaryColor: '#FF4500',
 * });
 */
export const generatePdfHtml = (
  templateId: PdfTemplateId,
  context: PdfTemplateContext
): string => {
  switch (templateId) {
    case 'classic':
      return classicTemplate(context);

    case 'modern':
      return modernTemplate(context);

    case 'minimal':
      return minimalTemplate(context);

    default:
      console.warn(
        `Unknown template ID: ${templateId}. Falling back to classic template.`
      );
      return classicTemplate(context);
  }
};

/**
 * Get list of all available templates
 *
 * @returns Array of template IDs with metadata
 */
export const getAvailableTemplates = () => {
  return [
    {
      id: 'classic' as const,
      name: 'Classic',
      description: 'Traditional layout with clean lines',
      preview: '📄',
    },
    {
      id: 'modern' as const,
      name: 'Modern',
      description: 'Contemporary design with bold typography',
      preview: '🎨',
    },
    {
      id: 'minimal' as const,
      name: 'Minimal',
      description: 'Clean and simple with lots of whitespace',
      preview: '✨',
    },
  ];
};
