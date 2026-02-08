// src/types/pdfTemplate.ts
import type { DocumentData, LineItem } from './document';
import type { BusinessProfile } from './businessProfile';
import type { CurrencyConfig } from './currency';

/**
 * Available PDF template styles
 */
export type PdfTemplateId = 'classic' | 'modern' | 'minimal';

/**
 * Calculations needed for PDF display
 */
export interface PdfCalculations {
  baseImponible: number;
  importeTax: number;
  total: number;
}

/**
 * Complete context passed to PDF template functions
 *
 * Contains all data needed to generate a PDF without external dependencies
 */
export interface PdfTemplateContext {
  /** Business profile information (replaces COMPANY constants) */
  business: BusinessProfile;

  /** Client information */
  client: {
    nombre: string;
    direccion: string;
    codigoPostal: string;
    ciudad: string;
    provincia: string;
    nifCif: string;
    email?: string;
    telefono?: string;
  };

  /** Document metadata */
  document: {
    tipo: 'factura' | 'presupuesto';
    numeroDocumento: string;
    fechaDocumento: string;
    comentarios?: string;
  };

  /** Line items (products/services) */
  lineItems: LineItem[];

  /** Calculated totals */
  calculations: PdfCalculations;

  /** Tax configuration */
  tax: {
    taxRate: number;
    taxName: string;
    reverseCharge: boolean;
  };

  /** Currency configuration for formatting */
  currency: CurrencyConfig;

  /** Pre-resolved i18n translations for this document's language */
  translations: Record<string, string>;

  /** Logo as base64 data URI (if available) */
  logoBase64: string | null;

  /** Primary brand color (hex) */
  primaryColor: string;
}

/**
 * PDF template function signature
 *
 * Takes context and returns complete HTML string ready for expo-print
 */
export type PdfTemplateFunction = (context: PdfTemplateContext) => string;

/**
 * Translation keys needed for PDF generation
 *
 * These should be pre-resolved before calling the template function
 */
export const PDF_TRANSLATION_KEYS = [
  // Document types
  'document.factura',
  'document.presupuesto',
  'document.numeroDocumento',
  'document.fechaDocumento',

  // Sections
  'document.datosEmpresa',
  'document.datosFacturacion',

  // Form labels
  'form.descripcion',
  'form.cantidad',
  'form.precio',
  'form.importe',

  // Totals
  'totals.base',
  'totals.iva',
  'totals.tax',
  'totals.total',

  // Payment
  'payment.metodoPago',
  'payment.transferencia',

  // Tax/IVA
  'iva.inversionNota',

  // Comments
  'comments.title',
] as const;
