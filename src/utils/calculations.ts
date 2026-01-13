import type { LineItem, IVARate } from '../types/document';

export const calculateLineImporte = (
  cantidad: number, 
  precioUnitario: number
): number => {
  return cantidad * precioUnitario;
};

export const calculateBaseImponible = (lineas: LineItem[]): number => {
  return lineas.reduce((sum, linea) => sum + linea.importe, 0);
};

export const calculateIVA = (base: number, rate: IVARate): number => {
  return base * (rate / 100);
};

export const calculateTotal = (base: number, iva: number): number => {
  return base + iva;
};

export const roundToTwoDecimals = (value: number): number => {
  return Math.round(value * 100) / 100;
};
