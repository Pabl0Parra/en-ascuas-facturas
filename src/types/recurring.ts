// src/types/recurring.ts

/**
 * Recurring Invoice System
 *
 * Allows users to set up automatic invoice generation on a schedule.
 * Invoices are generated on app launch if the next due date has passed.
 */

/**
 * Recurrence frequency options
 */
export type RecurrenceFrequency =
  | 'weekly' // Every 7 days
  | 'biweekly' // Every 14 days
  | 'monthly' // Every month (same day)
  | 'quarterly' // Every 3 months
  | 'yearly'; // Every year

/**
 * Day of week for weekly recurrence
 */
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

/**
 * Recurring Rule
 *
 * Defines when and how to automatically generate invoices
 */
export interface RecurringRule {
  /** Unique identifier */
  id: string;

  /** Template to use for generation */
  templateId: string;

  /** Rule name (e.g., "Monthly Hosting for Client ABC") */
  name: string;

  /** Rule description (optional) */
  description?: string;

  /** How often to generate */
  frequency: RecurrenceFrequency;

  /** Day of week (for weekly/biweekly only) */
  dayOfWeek?: DayOfWeek;

  /** Day of month (for monthly/quarterly/yearly, 1-28 to avoid month-end issues) */
  dayOfMonth?: number;

  /** Start date (first generation date) */
  startDate: string;

  /** End date (null = indefinite) */
  endDate: string | null;

  /** Next scheduled generation date (computed) */
  nextDueDate: string;

  /** Auto-increment invoice number */
  autoNumbering: boolean;

  /** Whether rule is active (can be paused) */
  isActive: boolean;

  /** Last time an invoice was generated */
  lastGeneratedDate: string | null;

  /** IDs of all generated documents */
  generatedDocumentIds: string[];

  /** Timestamps */
  createdAt: string;
  updatedAt: string;
}

/**
 * Recurring rule creation input
 * Omits auto-generated fields
 */
export type CreateRecurringRuleInput = Omit<
  RecurringRule,
  'id' | 'nextDueDate' | 'lastGeneratedDate' | 'generatedDocumentIds' | 'createdAt' | 'updatedAt'
>;

/**
 * Recurring rule update input
 * All fields optional
 */
export type UpdateRecurringRuleInput = Partial<Omit<RecurringRule, 'id' | 'createdAt'>>;

/**
 * Recurring rule filter options
 */
export interface RecurringRuleFilters {
  /** Filter by template ID */
  templateId?: string;

  /** Filter by frequency */
  frequency?: RecurrenceFrequency;

  /** Filter by active status */
  isActive?: boolean;

  /** Filter by due date (before/after specific date) */
  dueBefore?: string;
  dueAfter?: string;

  /** Search by name or description */
  searchQuery?: string;
}

/**
 * Recurring rule sort options
 */
export type RecurringRuleSortBy =
  | 'name' // Alphabetical by name
  | 'nextDueDate' // Next due first
  | 'lastGeneratedDate' // Most recently generated first
  | 'createdAt'; // Newest first

/**
 * Generation result
 *
 * Result of processing a recurring rule
 */
export interface RecurringGenerationResult {
  /** Rule that was processed */
  ruleId: string;

  /** Whether generation was successful */
  success: boolean;

  /** ID of generated document (if successful) */
  documentId?: string;

  /** Error message (if failed) */
  error?: string;

  /** Generation timestamp */
  generatedAt: string;
}

/**
 * Batch generation result
 *
 * Result of processing all due recurring rules
 */
export interface BatchGenerationResult {
  /** Total rules processed */
  totalProcessed: number;

  /** Number of successful generations */
  successCount: number;

  /** Number of failed generations */
  failureCount: number;

  /** Individual results */
  results: RecurringGenerationResult[];

  /** Processing timestamp */
  processedAt: string;
}

/**
 * Recurring analytics
 */
export interface RecurringAnalytics {
  /** Total recurring rules */
  totalRules: number;

  /** Active rules */
  activeRules: number;

  /** Paused rules */
  pausedRules: number;

  /** Rules by frequency */
  weeklyRules: number;
  biweeklyRules: number;
  monthlyRules: number;
  quarterlyRules: number;
  yearlyRules: number;

  /** Total documents generated */
  totalGenerated: number;

  /** Documents generated this month */
  generatedThisMonth: number;

  /** Next due rule */
  nextDueRule: RecurringRule | null;
}
