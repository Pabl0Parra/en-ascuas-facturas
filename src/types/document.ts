export type DocumentType = 'factura' | 'presupuesto';

// Document status lifecycle (Phase 3.5)
export type DocumentStatus =
  | 'draft'      // Created but not finalized
  | 'sent'       // Sent to client
  | 'viewed'     // Client opened the document
  | 'paid'       // Payment received
  | 'overdue'    // Past due date without payment
  | 'cancelled'; // Cancelled/voided

// Legacy type - kept for backward compatibility
export type IVARate = 0 | 21;

export interface LineItem {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  importe: number; // Calculado: cantidad * precioUnitario
  taxRate?: number; // Optional: override document-level tax rate (future feature)
}

// Metadata guardada en Zustand para el historial
export interface DocumentMetadata {
  id: string;
  tipo: DocumentType;
  numeroDocumento: string;
  fechaDocumento: string;
  clienteId: string; // Phase 3.4: Link to client for statistics
  clienteNombre: string;
  clienteNifCif: string;
  total: number;
  pdfFileName: string;
  createdAt: string;

  // Phase 3.5: Status tracking
  status?: DocumentStatus;      // Optional for backward compatibility (default: 'sent')
  paidAt?: string;              // ISO timestamp when marked as paid
  dueDate?: string;             // Due date for payment (dd-MM-yyyy format)
  paymentMethod?: string;       // Payment method used (e.g., "Bank Transfer", "Cash")
}

// Documento completo para generar PDF
export interface DocumentData {
  tipo: DocumentType;
  numeroDocumento: string;
  fechaDocumento: string;

  // Datos cliente
  clienteId: string;
  clienteNombre: string;
  clienteDireccion: string;
  clienteCodigoPostal: string;
  clienteCiudad: string;
  clienteProvincia: string;
  clienteNifCif: string;

  // Líneas
  lineas: LineItem[];

  // Tax (flexible system - replaces tipoIVA)
  taxRate: number; // 0-100 (percentage)
  taxName: string; // "IVA", "VAT", "GST", etc.
  reverseCharge: boolean; // For ISP / Reverse Charge

  // Legacy field - kept for backward compatibility
  tipoIVA?: IVARate; // Optional now, will be migrated to taxRate

  // Totales (calculados)
  baseImponible: number;
  importeIVA: number; // Will be renamed to importeTax in future, kept for compatibility
  total: number;

  // Metadata for formatting
  currency: string; // ISO 4217: "EUR", "USD", "GBP"
  locale: string; // BCP 47: "es-ES", "en-US"

  // Comentarios / Observaciones
  comentarios: string;
}

export type DocumentFormData = Omit<
  DocumentData,
  'baseImponible' | 'importeIVA' | 'total'
>;
