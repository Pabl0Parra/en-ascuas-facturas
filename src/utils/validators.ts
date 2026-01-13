export const isValidNIF = (nif: string): boolean => {
  // Regex básico para NIF/CIF español
  const nifRegex = /^[0-9]{8}[A-Z]$/i;
  const cifRegex = /^[A-Z][0-9]{7}[A-Z0-9]$/i;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/i;
  
  return nifRegex.test(nif) || cifRegex.test(nif) || nieRegex.test(nif);
};

export const isValidPostalCode = (cp: string): boolean => {
  return /^[0-9]{5}$/.test(cp);
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

export const isPositiveNumber = (value: number): boolean => {
  return value > 0;
};

export const isValidPhoneNumber = (phone: string): boolean => {
  // Spanish phone numbers (fixed or mobile)
  return /^[679][0-9]{8}$/.test(phone.replace(/\s/g, ''));
};
