// src/utils/idGenerator.ts
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const generatePDFFileName = (
  tipo: 'factura' | 'presupuesto',
  numero: string,
  clienteNombre: string
): string => {
  const tipoLabel = tipo === 'factura' ? 'FACTURA' : 'PRESUPUESTO';
  const cleanNombre = clienteNombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 20);
  
  return `${tipoLabel}_${numero}_${cleanNombre}`;
};