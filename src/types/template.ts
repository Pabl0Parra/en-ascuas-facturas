// src/types/template.ts
import type { LineItem } from './document';

/**
 * Document Template
 *
 * Allows users to save frequently-used invoice/quote configurations
 * as reusable templates. Reduces data entry and ensures consistency.
 */
export interface DocumentTemplate {
  /** Unique identifier */
  id: string;

  /** User-friendly template name (e.g., "Monthly Hosting Fee", "Standard Catering") */
  name: string;

  /** Template description (optional) */
  description?: string;

  /** Type of document this template generates */
  type: 'invoice' | 'quote';

  /** Pre-selected client ID (optional - can be set when using template) */
  clientId: string | null;

  /** Pre-filled line items with descriptions, quantities, and prices */
  lineItems: LineItem[];

  /** Tax rate to apply (can be overridden when using template) */
  taxRate: number;

  /** Tax name (e.g., "VAT", "IVA", "GST") */
  taxName: string;

  /** Currency code (ISO 4217) */
  currency: string;

  /** Pre-filled comments/notes (optional) */
  comments: string;

  /** Whether this is a favorite template (for quick access) */
  isFavorite: boolean;

  /** Usage statistics */
  usageCount: number;

  /** Last time this template was used */
  lastUsedAt: string | null;

  /** Timestamps */
  createdAt: string;
  updatedAt: string;
}

/**
 * Template creation input
 * Omits auto-generated fields
 */
export type CreateTemplateInput = Omit<
  DocumentTemplate,
  'id' | 'usageCount' | 'lastUsedAt' | 'createdAt' | 'updatedAt'
>;

/**
 * Template update input
 * All fields optional except template name
 */
export type UpdateTemplateInput = Partial<Omit<DocumentTemplate, 'id' | 'createdAt'>>;

/**
 * Template filter options
 */
export interface TemplateFilters {
  /** Filter by document type */
  type?: 'invoice' | 'quote';

  /** Filter by client ID */
  clientId?: string;

  /** Filter by favorite status */
  isFavorite?: boolean;

  /** Search by name or description */
  searchQuery?: string;
}

/**
 * Template sort options
 */
export type TemplateSortBy =
  | 'name' // Alphabetical by name
  | 'createdAt' // Newest first
  | 'lastUsedAt' // Most recently used first
  | 'usageCount'; // Most used first

/**
 * Template metadata for analytics
 */
export interface TemplateAnalytics {
  /** Total number of templates */
  totalTemplates: number;

  /** Templates by type */
  invoiceTemplates: number;
  quoteTemplates: number;

  /** Favorite templates count */
  favoriteTemplates: number;

  /** Most used template */
  mostUsedTemplate: DocumentTemplate | null;

  /** Recently created templates (last 7 days) */
  recentlyCreated: number;
}
