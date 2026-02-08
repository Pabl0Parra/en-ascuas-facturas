/**
 * Client tags/categories for organization
 */
export type ClientTag = 'regular' | 'vip' | 'new' | 'inactive' | 'international' | 'domestic';

/**
 * Client interface with enhanced fields
 */
export interface Client {
  id: string;
  nombre: string;
  direccion: string;
  codigoPostal: string;
  ciudad: string;
  provincia: string;
  nifCif: string;
  email?: string;
  telefono?: string;

  // Enhanced fields (Phase 3.3)
  tags?: ClientTag[];                    // Categories for filtering
  notes?: string;                        // Internal notes
  defaultCurrency?: string;              // Preferred currency (overrides business default)
  defaultTaxRate?: number;               // Preferred tax rate (overrides business default)
  paymentTerms?: string;                 // e.g., "Net 30", "Due on receipt"

  createdAt: string;
  updatedAt: string;
}

/**
 * Client form data (omits generated fields)
 */
export type ClientFormData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Client filter options
 */
export interface ClientFilters {
  tags?: ClientTag[];
  searchQuery?: string;
  hasEmail?: boolean;
  createdAfter?: string;
  createdBefore?: string;
}

/**
 * Client sort options
 */
export type ClientSortBy = 'name' | 'createdAt' | 'updatedAt' | 'totalInvoiced';

/**
 * Client usage statistics
 */
export interface ClientStats {
  totalInvoices: number;
  totalQuotes: number;
  totalInvoiced: number;
  lastInvoiceDate: string | null;
  lastQuoteDate: string | null;
}
