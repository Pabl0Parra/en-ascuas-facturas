// src/services/recurringService.ts
import {
  addDays,
  addWeeks,
  addMonths,
  addQuarters,
  addYears,
  format,
  parseISO,
  isBefore,
  isAfter,
} from 'date-fns';
import { useRecurringStore } from '../stores/recurringStore';
import { useTemplateStore } from '../stores/templateStore';
import { useDocumentStore } from '../stores/documentStore';
import { useBusinessProfileStore } from '../stores/businessProfileStore';
import { useClientStore } from '../stores/clientStore';
import type {
  RecurringRule,
  RecurrenceFrequency,
  RecurringGenerationResult,
  BatchGenerationResult,
} from '../types/recurring';
import type { DocumentMetadata } from '../types/document';
import { generateSecureId } from '../utils/idGenerator';

/**
 * Recurring Invoice Service
 *
 * Handles automatic document generation based on recurring rules.
 * Call `processRecurringRules()` on app launch to generate due invoices.
 */

/**
 * Calculate next due date based on current date and frequency
 */
export const calculateNextDueDate = (
  currentDate: string,
  frequency: RecurrenceFrequency
): string => {
  const date = parseISO(currentDate);

  switch (frequency) {
    case 'weekly':
      return format(addWeeks(date, 1), 'yyyy-MM-dd');

    case 'biweekly':
      return format(addWeeks(date, 2), 'yyyy-MM-dd');

    case 'monthly':
      return format(addMonths(date, 1), 'yyyy-MM-dd');

    case 'quarterly':
      return format(addQuarters(date, 1), 'yyyy-MM-dd');

    case 'yearly':
      return format(addYears(date, 1), 'yyyy-MM-dd');

    default:
      throw new Error(`Unknown frequency: ${frequency}`);
  }
};

/**
 * Generate invoice number for recurring rule
 */
const generateInvoiceNumber = (autoNumbering: boolean): string => {
  if (!autoNumbering) {
    // Manual numbering - user will set it
    return '';
  }

  // Auto-numbering - use business profile
  const businessProfile = useBusinessProfileStore.getState().profile;
  if (!businessProfile) {
    return 'INV-0001'; // Fallback
  }

  const currentNumber = useBusinessProfileStore.getState().incrementInvoiceNumber();
  return `${businessProfile.invoicePrefix}${String(currentNumber).padStart(4, '0')}`;
};

/**
 * Generate a single document from a recurring rule
 */
const generateDocumentFromRule = (rule: RecurringRule): RecurringGenerationResult => {
  const now = new Date().toISOString();

  try {
    // Get template
    const template = useTemplateStore.getState().getTemplateById(rule.templateId);
    if (!template) {
      return {
        ruleId: rule.id,
        success: false,
        error: `Template not found: ${rule.templateId}`,
        generatedAt: now,
      };
    }

    // Get client info from template if available
    const client = template.clientId
      ? useClientStore.getState().getClientById(template.clientId)
      : null;

    // Generate invoice number
    const numeroDocumento = generateInvoiceNumber(rule.autoNumbering);

    // Calculate totals
    const baseImponible = template.lineItems.reduce((sum, item) => sum + item.importe, 0);
    const importeIVA = Math.round(baseImponible * (template.taxRate / 100) * 100) / 100;
    const total = baseImponible + importeIVA;

    // Save document metadata
    const savedDocument = useDocumentStore.getState().addDocument({
      tipo: template.type === 'invoice' ? 'factura' : 'presupuesto',
      numeroDocumento,
      fechaDocumento: format(new Date(), 'dd-MM-yyyy'),
      clienteId: client?.id || '',
      clienteNombre: client?.nombre || 'Sin Cliente',
      clienteNifCif: client?.nifCif || '-',
      total,
      pdfFileName: '', // PDF not generated yet for recurring documents
    });

    // Record generation in recurring store
    useRecurringStore.getState().recordGeneration(rule.id, savedDocument.id);

    // Calculate and update next due date
    const nextDueDate = calculateNextDueDate(rule.nextDueDate, rule.frequency);
    useRecurringStore.getState().updateNextDueDate(rule.id, nextDueDate);

    // Record template usage
    useTemplateStore.getState().recordTemplateUsage(rule.templateId);

    return {
      ruleId: rule.id,
      success: true,
      documentId: savedDocument.id,
      generatedAt: now,
    };
  } catch (error) {
    return {
      ruleId: rule.id,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      generatedAt: now,
    };
  }
};

/**
 * Check if rule has passed its end date
 */
const isRuleExpired = (rule: RecurringRule): boolean => {
  if (!rule.endDate) {
    return false; // No end date = runs indefinitely
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  return isAfter(parseISO(today), parseISO(rule.endDate));
};

/**
 * Process all due recurring rules
 *
 * Call this on app launch to generate invoices for rules
 * where nextDueDate <= today
 */
export const processRecurringRules = async (
  asOfDate?: string
): Promise<BatchGenerationResult> => {
  const now = new Date().toISOString();

  // Get all due rules
  const dueRules = useRecurringStore.getState().getDueRules(asOfDate);

  const results: RecurringGenerationResult[] = [];

  for (const rule of dueRules) {
    // Check if rule has expired
    if (isRuleExpired(rule)) {
      // Pause expired rule
      useRecurringStore.getState().pauseRule(rule.id);
      results.push({
        ruleId: rule.id,
        success: false,
        error: 'Rule has expired (past end date)',
        generatedAt: now,
      });
      continue;
    }

    // Generate document
    const result = generateDocumentFromRule(rule);
    results.push(result);
  }

  const successCount = results.filter((r) => r.success).length;
  const failureCount = results.filter((r) => !r.success).length;

  return {
    totalProcessed: results.length,
    successCount,
    failureCount,
    results,
    processedAt: now,
  };
};

/**
 * Generate all missed invoices for a rule
 *
 * If app hasn't been opened in weeks/months, this will generate
 * all missed invoices based on the schedule.
 */
export const generateMissedInvoices = async (
  ruleId: string
): Promise<RecurringGenerationResult[]> => {
  const rule = useRecurringStore.getState().getRuleById(ruleId);
  if (!rule) {
    return [
      {
        ruleId,
        success: false,
        error: 'Rule not found',
        generatedAt: new Date().toISOString(),
      },
    ];
  }

  if (!rule.isActive) {
    return [
      {
        ruleId,
        success: false,
        error: 'Rule is not active',
        generatedAt: new Date().toISOString(),
      },
    ];
  }

  const results: RecurringGenerationResult[] = [];
  const today = format(new Date(), 'yyyy-MM-dd');

  // Generate all missed invoices
  let currentDueDate = rule.nextDueDate;

  while (isBefore(parseISO(currentDueDate), parseISO(today))) {
    // Check if rule has expired
    if (isRuleExpired(rule)) {
      break;
    }

    // Generate invoice for this due date
    const result = generateDocumentFromRule(rule);
    results.push(result);

    // Move to next due date
    currentDueDate = calculateNextDueDate(currentDueDate, rule.frequency);
  }

  return results;
};

/**
 * Preview next N due dates for a rule
 *
 * Useful for showing user when invoices will be generated
 */
export const previewNextDueDates = (
  startDate: string,
  frequency: RecurrenceFrequency,
  count: number = 12
): string[] => {
  const dates: string[] = [];
  let currentDate = startDate;

  for (let i = 0; i < count; i++) {
    dates.push(currentDate);
    currentDate = calculateNextDueDate(currentDate, frequency);
  }

  return dates;
};

/**
 * Get human-readable frequency description
 */
export const getFrequencyDescription = (frequency: RecurrenceFrequency): string => {
  switch (frequency) {
    case 'weekly':
      return 'Every week';
    case 'biweekly':
      return 'Every 2 weeks';
    case 'monthly':
      return 'Every month';
    case 'quarterly':
      return 'Every 3 months';
    case 'yearly':
      return 'Every year';
    default:
      return frequency;
  }
};
