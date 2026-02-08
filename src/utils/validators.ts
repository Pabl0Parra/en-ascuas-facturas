export const isValidNIF = (nif: string): boolean => {
  // Regex básico para NIF/CIF español
  const nifRegex = /^\d{8}[A-Z]$/i;
  const cifRegex = /^[A-Z]\d{7}[A-Z0-9]$/i;
  const nieRegex = /^[XYZ]\d{7}[A-Z]$/i;

  return nifRegex.test(nif) || cifRegex.test(nif) || nieRegex.test(nif);
};

export const isValidPostalCode = (cp: string): boolean => {
  return /^\d{5}$/.test(cp);
};

export const isValidEmail = (email: string): boolean => {
  // Safe from ReDoS: no nested quantifiers, specific character counts
  // Pattern: localpart@domain.tld
  if (email.length > 254) return false; // RFC 5321 limit

  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const [local, domain] = parts;

  // Local part: 1-64 chars, no whitespace
  if (!local || local.length > 64 || /\s/.test(local)) return false;

  // Domain: must have at least one dot, no whitespace
  if (!domain || domain.length > 253 || /\s/.test(domain) || !domain.includes('.')) return false;

  // Check for valid characters (simple version)
  if (!/^[a-zA-Z0-9._%-]+$/.test(local)) return false;
  if (!/^[a-zA-Z0-9.-]+$/.test(domain)) return false;

  // Domain must not start/end with dot or hyphen
  if (domain.startsWith('.') || domain.startsWith('-') ||
    domain.endsWith('.') || domain.endsWith('-')) return false;

  return true;
};

export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

export const isPositiveNumber = (value: number): boolean => {
  return value > 0;
};

export const isValidPhoneNumber = (phone: string): boolean => {
  // Spanish phone numbers (fixed or mobile)
  // Remove spaces first to avoid any potential issues
  const cleaned = phone.replaceAll(/\s/g, '');
  return /^[679]\d{8}$/.test(cleaned);
};