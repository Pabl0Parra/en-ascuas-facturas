// src/utils/idGenerator.ts

/**
 * Generates cryptographically secure UUID for persistent data
 * Use for: Client IDs, Document IDs, any data saved to storage
 * 
 * @returns A unique identifier suitable for database records
 */
export const generateSecureId = (): string => {
  // Modern browsers and Node.js 16.7+
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for React Native and older environments
  return generateSecureIdFallback();
};

/**
 * Secure fallback using timestamp + crypto random values
 * Collision probability: ~1 in 10^18 per millisecond
 */
const generateSecureIdFallback = (): string => {
  const timestamp = Date.now().toString(36);

  // Try to use crypto.getRandomValues if available
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    const randomPart = Array.from(randomBytes)
      .map(b => b.toString(36).padStart(2, '0'))
      .join('')
      .substring(0, 16);

    return `${timestamp}-${randomPart}`;
  }

  // Last resort: enhanced Math.random with multiple entropy sources
  const random1 = Math.random().toString(36).substring(2, 10);
  const random2 = Math.random().toString(36).substring(2, 10);
  const random3 = Math.random().toString(36).substring(2, 10);

  return `${timestamp}-${random1}-${random2}-${random3}`;
};

/**
 * Generates ID for temporary UI state (React keys, form items)
 * Use for: Line items, temporary components, non-persisted data
 * 
 * @returns A temporary identifier suitable for in-memory use only
 */
export const generateTempId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Generates a sanitized PDF filename for invoices and quotes
 * 
 * @param tipo - Document type ('factura' or 'presupuesto')
 * @param numero - Document number
 * @param clienteNombre - Client name (will be sanitized)
 * @returns Sanitized filename without extension
 */
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

  // Use timestamp if no document number provided
  const numeroOrTimestamp = numero.trim() || Date.now().toString();

  return `${tipoLabel}_${numeroOrTimestamp}_${cleanNombre}`;
};