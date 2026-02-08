// src/services/pdfGenerator.ts
import * as Print from 'expo-print';
import type { DocumentData } from '../types/document';
import type { PdfTemplateContext, PdfTemplateId } from '../types/pdfTemplate';
import { generatePdfHtml } from './pdfTemplates/templateEngine';
import { useBusinessProfileStore } from '../stores/businessProfileStore';
import { getCurrencyConfig } from '../config/currencyConfig';
import { getTranslations } from '../i18n';
import { COMPANY } from '../constants/company';
import { LOGO_BASE64 } from '../constants/logo';

/**
 * Build PDF template context from document data
 *
 * Prepares all data needed for PDF generation without external dependencies
 */
const buildPdfContext = (data: DocumentData): PdfTemplateContext => {
  // Get business profile (fallback to legacy COMPANY if not available)
  const businessProfile = useBusinessProfileStore.getState().profile;

  const business = businessProfile || {
    id: 'legacy',
    companyName: COMPANY.nombre,
    address: COMPANY.direccion,
    postalCode: COMPANY.codigoPostal,
    city: COMPANY.ciudad,
    region: COMPANY.provincia,
    country: 'ES',
    taxIdLabel: 'NIF',
    taxId: COMPANY.nif,
    paymentMethod: COMPANY.metodoPago,
    paymentDetails: COMPANY.iban,
    logoUri: null,
    primaryColor: '#FF4500',
    currency: 'EUR',
    locale: 'es-ES',
    defaultTaxRate: 21,
    taxName: 'IVA',
    invoicePrefix: 'FA-',
    quotePrefix: 'PRE-',
    nextInvoiceNumber: 1,
    nextQuoteNumber: 1,
    preferredTemplate: 'classic' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Get currency configuration
  const currencyConfig = getCurrencyConfig(business.currency);

  // Pre-resolve i18n translations
  const translations = getTranslations([
    'document.factura',
    'document.presupuesto',
    'document.numeroDocumento',
    'document.fechaDocumento',
    'document.datosEmpresa',
    'document.datosFacturacion',
    'form.descripcion',
    'form.cantidad',
    'form.precio',
    'form.importe',
    'totals.base',
    'totals.iva',
    'totals.tax',
    'totals.total',
    'payment.metodoPago',
    'iva.inversionNota',
    'comments.title',
  ]);

  // Prepare logo (prefer business profile logo, fallback to legacy LOGO_BASE64)
  const logoBase64 = business.logoUri || `data:image/png;base64,${LOGO_BASE64}`;

  // Build context
  const context: PdfTemplateContext = {
    business,
    client: {
      nombre: data.clienteNombre,
      direccion: data.clienteDireccion,
      codigoPostal: data.clienteCodigoPostal,
      ciudad: data.clienteCiudad,
      provincia: data.clienteProvincia,
      nifCif: data.clienteNifCif,
    },
    document: {
      tipo: data.tipo,
      numeroDocumento: data.numeroDocumento,
      fechaDocumento: data.fechaDocumento,
      comentarios: data.comentarios,
    },
    lineItems: data.lineas,
    calculations: {
      baseImponible: data.baseImponible,
      importeTax: data.importeIVA,
      total: data.total,
    },
    tax: {
      taxRate: data.taxRate || data.tipoIVA || 21,
      taxName: data.taxName || business.taxName || 'IVA',
      reverseCharge: data.reverseCharge || data.tipoIVA === 0,
    },
    currency: currencyConfig,
    translations,
    logoBase64,
    primaryColor: business.primaryColor,
  };

  return context;
};

/**
 * Generate invoice HTML using dynamic templates
 *
 * @param data - Document data
 * @param templateId - Optional template to use (defaults to business profile preference)
 * @returns Complete HTML string
 */
export const generateInvoiceHTML = (
  data: DocumentData,
  templateId?: PdfTemplateId
): string => {
  const context = buildPdfContext(data);

  // Use specified template or fallback to business profile preference
  const template =
    templateId ||
    useBusinessProfileStore.getState().profile?.preferredTemplate ||
    'classic';

  return generatePdfHtml(template, context);
};

/**
 * Create PDF file from document data
 *
 * @param data - Document data
 * @param templateId - Optional template to use
 * @returns URI of the generated PDF file
 */
export const createPDF = async (
  data: DocumentData,
  templateId?: PdfTemplateId
): Promise<string> => {
  const html = generateInvoiceHTML(data, templateId);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  return uri;
};
