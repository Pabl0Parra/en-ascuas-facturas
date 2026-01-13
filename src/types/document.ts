export type DocumentType = 'factura' | 'presupuesto';

export type IVARate = 0 | 21;

export interface LineItem {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  importe: number; // Calculado: cantidad * precioUnitario
}

// Metadata guardada en Zustand para el historial
export interface DocumentMetadata {
  id: string;
  tipo: DocumentType;
  numeroDocumento: string;
  fechaDocumento: string;
  clienteNombre: string;
  clienteNifCif: string;
  total: number;
  pdfFileName: string;
  createdAt: string;
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

  // IVA
  tipoIVA: IVARate;

  // Totales (calculados)
  baseImponible: number;
  importeIVA: number;
  total: number;

  // Comentarios / Observaciones
  comentarios: string; // <-- Add this
}

export type DocumentFormData = Omit<
  DocumentData,
  'baseImponible' | 'importeIVA' | 'total'
>;
