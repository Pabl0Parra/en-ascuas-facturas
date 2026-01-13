import { create } from 'zustand';
import type { DocumentType, IVARate, LineItem } from '../types/document';
import { generateId } from '../utils/idGenerator';
import {
  calculateLineImporte,
  calculateBaseImponible,
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
  tipoIVA: IVARate;
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

  // IVA
  setTipoIVA: (tipo: IVARate) => void;

  // Calculated getters
  getBaseImponible: () => number;
  getImporteIVA: () => number;
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
  id: generateId(),
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

  setTipoIVA: (tipo: IVARate): void => {
    set({ tipoIVA: tipo });
  },

  getBaseImponible: (): number => {
    return roundToTwoDecimals(calculateBaseImponible(get().lineas));
  },

  getImporteIVA: (): number => {
    const base = get().getBaseImponible();
    return roundToTwoDecimals(calculateIVA(base, get().tipoIVA));
  },

  getTotal: (): number => {
    const base = get().getBaseImponible();
    const iva = get().getImporteIVA();
    return roundToTwoDecimals(calculateTotal(base, iva));
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
