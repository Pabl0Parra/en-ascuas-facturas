// src/stores/formStore.ts
import { create } from 'zustand';
import type { DocumentType, IVARate, LineItem } from '../types/document';
import { generateTempId } from '../utils/idGenerator';
import {
  calculateLineImporte,
  calculateBaseImponible,
  calculateTax,
  calculateIVA,
  calculateTotal,
  roundToTwoDecimals,
} from '../utils/calculations';
import { getTodayISO } from '../utils/formatters';

interface FormStore {
  // Estado del formulario actual
  documentType: DocumentType;
  numeroDocumento: string;
  fechaDocumento: string;
  selectedClientId: string | null;
  lineas: LineItem[];

  // Flexible tax system (replaces tipoIVA)
  taxRate: number; // 0-100 (percentage)
  taxName: string; // "IVA", "VAT", "GST", etc.
  reverseCharge: boolean; // For ISP / Reverse Charge

  // Currency and locale for formatting
  currency: string; // ISO 4217
  locale: string; // BCP 47

  // Legacy field - kept for backward compatibility
  tipoIVA?: IVARate;

  comentarios: string;

  // Actions
  setDocumentType: (tipo: DocumentType) => void;
  setNumeroDocumento: (numero: string) => void;
  setFechaDocumento: (fecha: string) => void;
  setSelectedClient: (clientId: string | null) => void;
  setComentarios: (comentarios: string) => void;

  // Líneas
  addLinea: () => void;
  updateLinea: (
    id: string,
    data: Partial<Omit<LineItem, 'id' | 'importe'>>,
  ) => void;
  removeLinea: (id: string) => void;

  // Tax management
  setTaxRate: (rate: number) => void;
  setTaxName: (name: string) => void;
  setReverseCharge: (enabled: boolean) => void;
  setCurrency: (currency: string) => void;
  setLocale: (locale: string) => void;

  // Legacy - kept for backward compatibility
  setTipoIVA: (tipo: IVARate) => void;

  // Calculated getters
  getBaseImponible: () => number;
  getImporteIVA: () => number; // Legacy name, returns tax amount
  getImporteTax: () => number; // New name for tax amount
  getTotal: () => number;

  // Reset
  resetForm: () => void;
  initializeForm: (
    tipo: DocumentType,
    numeroDocumento: string,
    fecha?: string,
  ) => void;
}

const createEmptyLinea = (): LineItem => ({
  id: generateTempId(),
  descripcion: '',
  cantidad: 1,
  precioUnitario: 0,
  importe: 0,
});

const initialState = {
  documentType: 'factura' as DocumentType,
  numeroDocumento: '',
  fechaDocumento: getTodayISO(),
  selectedClientId: null,
  lineas: [createEmptyLinea()],

  // Flexible tax system
  taxRate: 21, // Default to 21% (Spanish IVA standard)
  taxName: 'IVA',
  reverseCharge: false,
  currency: 'EUR',
  locale: 'es-ES',

  // Legacy field
  tipoIVA: 21 as IVARate,

  comentarios: '',
};

export const useFormStore = create<FormStore>((set, get) => ({
  ...initialState,

  setDocumentType: (tipo: DocumentType): void => {
    set({ documentType: tipo });
  },

  setNumeroDocumento: (numero: string): void => {
    set({ numeroDocumento: numero });
  },

  setFechaDocumento: (fecha: string): void => {
    set({ fechaDocumento: fecha });
  },

  setSelectedClient: (clientId: string | null): void => {
    set({ selectedClientId: clientId });
  },

  setComentarios: (comentarios: string): void => {
    set({ comentarios });
  },

  // Tax management actions
  setTaxRate: (rate: number): void => {
    set({ taxRate: rate });
  },

  setTaxName: (name: string): void => {
    set({ taxName: name });
  },

  setReverseCharge: (enabled: boolean): void => {
    set({ reverseCharge: enabled });
  },

  setCurrency: (currency: string): void => {
    set({ currency });
  },

  setLocale: (locale: string): void => {
    set({ locale });
  },

  // Legacy action - converts to new taxRate
  setTipoIVA: (tipo: IVARate): void => {
    set({ tipoIVA: tipo, taxRate: tipo });
  },

  addLinea: (): void => {
    set((state) => ({
      lineas: [...state.lineas, createEmptyLinea()],
    }));
  },

  updateLinea: (
    id: string,
    data: Partial<Omit<LineItem, 'id' | 'importe'>>,
  ): void => {
    set((state) => ({
      lineas: state.lineas.map((linea) => {
        if (linea.id !== id) return linea;

        const updatedLinea = { ...linea, ...data };
        updatedLinea.importe = roundToTwoDecimals(
          calculateLineImporte(
            updatedLinea.cantidad,
            updatedLinea.precioUnitario,
          ),
        );
        return updatedLinea;
      }),
    }));
  },

  removeLinea: (id: string): void => {
    set((state) => ({
      lineas: state.lineas.filter((linea) => linea.id !== id),
    }));
  },

  // Calculation methods
  getBaseImponible: (): number => {
    return roundToTwoDecimals(calculateBaseImponible(get().lineas));
  },

  getImporteIVA: (): number => {
    // Legacy method - uses new taxRate internally
    const base = get().getBaseImponible();
    return roundToTwoDecimals(calculateTax(base, get().taxRate));
  },

  getImporteTax: (): number => {
    // New method name - same implementation
    const base = get().getBaseImponible();
    return roundToTwoDecimals(calculateTax(base, get().taxRate));
  },

  getTotal: (): number => {
    const base = get().getBaseImponible();
    const tax = get().getImporteTax();
    return roundToTwoDecimals(calculateTotal(base, tax));
  },

  resetForm: (): void => {
    set({
      ...initialState,
      fechaDocumento: getTodayISO(),
      lineas: [createEmptyLinea()],
      comentarios: '',
    });
  },

  initializeForm: (
    tipo: DocumentType,
    numeroDocumento: string,
    fecha?: string,
  ): void => {
    set({
      ...initialState,
      documentType: tipo,
      numeroDocumento,
      fechaDocumento: fecha || getTodayISO(),
      lineas: [createEmptyLinea()],
      comentarios: '',
    });
  },
}));