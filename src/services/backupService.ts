// src/services/backupService.ts

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useBusinessProfileStore } from '../stores/businessProfileStore';
import { useClientStore } from '../stores/clientStore';
import { useDocumentStore } from '../stores/documentStore';
import { useTemplateStore } from '../stores/templateStore';
import { useRecurringStore } from '../stores/recurringStore';
import { useTaxConfigStore } from '../stores/taxConfigStore';

/**
 * Backup Service
 *
 * Handles export, import, and validation of app data backups.
 */

export interface AppBackup {
  version: string;
  schemaVersion: number;
  exportedAt: string;
  businessProfile: any;
  clients: any[];
  documents: any[];
  templates: any[];
  recurringRules: any[];
  taxConfig: any;
}

const CURRENT_SCHEMA_VERSION = 1;
const SUPPORTED_SCHEMA_VERSIONS = [1];

/**
 * Validate backup schema
 */
export const validateBackup = (data: any): { valid: boolean; error?: string } => {
  // Check if data is valid JSON object
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid backup file: not a valid JSON object' };
  }

  // Check required fields
  const requiredFields = ['version', 'schemaVersion', 'exportedAt'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      return { valid: false, error: `Invalid backup file: missing field "${field}"` };
    }
  }

  // Check schema version
  if (!SUPPORTED_SCHEMA_VERSIONS.includes(data.schemaVersion)) {
    return {
      valid: false,
      error: `Unsupported backup version: ${data.schemaVersion}. Supported versions: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}`,
    };
  }

  // Check data structure
  const dataFields = ['businessProfile', 'clients', 'documents', 'templates', 'recurringRules', 'taxConfig'];
  for (const field of dataFields) {
    if (!(field in data)) {
      return { valid: false, error: `Invalid backup file: missing data field "${field}"` };
    }
  }

  // Validate arrays
  if (!Array.isArray(data.clients)) {
    return { valid: false, error: 'Invalid backup file: clients must be an array' };
  }
  if (!Array.isArray(data.documents)) {
    return { valid: false, error: 'Invalid backup file: documents must be an array' };
  }
  if (!Array.isArray(data.templates)) {
    return { valid: false, error: 'Invalid backup file: templates must be an array' };
  }
  if (!Array.isArray(data.recurringRules)) {
    return { valid: false, error: 'Invalid backup file: recurringRules must be an array' };
  }

  return { valid: true };
};

/**
 * Migrate backup to current schema version
 */
export const migrateBackup = (backup: AppBackup): AppBackup => {
  // Currently only version 1 exists, so no migration needed
  // Future: add migration logic when schema changes
  if (backup.schemaVersion === 1) {
    return backup;
  }

  // Default: return as-is
  return backup;
};

/**
 * Export all app data as backup
 */
export const exportBackup = async (): Promise<{
  success: boolean;
  error?: string;
  fileUri?: string;
}> => {
  try {
    // Gather all data
    const businessProfile = useBusinessProfileStore.getState().profile;
    const clients = useClientStore.getState().clients;
    const documents = useDocumentStore.getState().documents;
    const templates = useTemplateStore.getState().templates;
    const recurringRules = useRecurringStore.getState().rules;
    const taxConfig = useTaxConfigStore.getState().config;

    // Create backup object
    const backup: AppBackup = {
      version: '2.0.0',
      schemaVersion: CURRENT_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      businessProfile,
      clients,
      documents,
      templates,
      recurringRules,
      taxConfig,
    };

    // Convert to JSON
    const jsonData = JSON.stringify(backup, null, 2);

    // Create file
    const date = new Date().toISOString().split('T')[0];
    const fileName = `en-ascuas-backup-${date}.json`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, jsonData);

    // Share file
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Data Backup',
      });
    }

    return { success: true, fileUri };
  } catch (error) {
    console.error('Export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during export',
    };
  }
};

/**
 * Import backup from file
 */
export const importBackup = async (): Promise<{
  success: boolean;
  error?: string;
  imported?: {
    clients: number;
    documents: number;
    templates: number;
    recurringRules: number;
  };
}> => {
  try {
    // Pick file
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return { success: false, error: 'Import cancelled' };
    }

    const file = result.assets[0];

    // Read file content
    const fileContent = await FileSystem.readAsStringAsync(file.uri);

    // Parse JSON
    let backup: AppBackup;
    try {
      backup = JSON.parse(fileContent);
    } catch (error) {
      return { success: false, error: 'Invalid JSON file' };
    }

    // Validate backup
    const validation = validateBackup(backup);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Migrate if needed
    backup = migrateBackup(backup);

    // Import data
    // Business Profile
    if (backup.businessProfile) {
      useBusinessProfileStore.getState().setProfile(backup.businessProfile);
    }

    // Clients (merge, not replace - avoid duplicates)
    const existingClientIds = new Set(useClientStore.getState().clients.map((c) => c.id));
    const newClients = backup.clients.filter((c) => !existingClientIds.has(c.id));
    for (const client of newClients) {
      useClientStore.getState().addClient(client);
    }

    // Documents (merge, not replace - avoid duplicates)
    const existingDocIds = new Set(useDocumentStore.getState().documents.map((d) => d.id));
    const newDocuments = backup.documents.filter((d) => !existingDocIds.has(d.id));
    for (const doc of newDocuments) {
      useDocumentStore.getState().addDocument(doc);
    }

    // Templates (merge, not replace - avoid duplicates)
    const existingTemplateIds = new Set(useTemplateStore.getState().templates.map((t) => t.id));
    const newTemplates = backup.templates.filter((t) => !existingTemplateIds.has(t.id));
    for (const template of newTemplates) {
      useTemplateStore.getState().createTemplate({
        name: template.name,
        description: template.description,
        type: template.type,
        clientId: template.clientId,
        lineItems: template.lineItems,
        taxRate: template.taxRate,
        taxName: template.taxName,
        currency: template.currency,
        comments: template.comments,
        isFavorite: template.isFavorite,
      });
    }

    // Recurring Rules (merge, not replace - avoid duplicates)
    const existingRuleIds = new Set(useRecurringStore.getState().rules.map((r) => r.id));
    const newRules = backup.recurringRules.filter((r) => !existingRuleIds.has(r.id));
    for (const rule of newRules) {
      useRecurringStore.getState().createRule({
        name: rule.name,
        description: rule.description,
        templateId: rule.templateId,
        frequency: rule.frequency,
        dayOfWeek: rule.dayOfWeek,
        dayOfMonth: rule.dayOfMonth,
        startDate: rule.startDate,
        endDate: rule.endDate,
        autoNumbering: rule.autoNumbering,
        isActive: rule.isActive,
      });
    }

    // Tax Config (replace if backup has it)
    if (backup.taxConfig && backup.taxConfig.presets) {
      // Keep existing presets and add new ones from backup
      const existingPresetIds = new Set(
        useTaxConfigStore.getState().config.presets.map((p) => p.id)
      );
      const newPresets = backup.taxConfig.presets.filter(
        (p: any) => !existingPresetIds.has(p.id)
      );
      for (const preset of newPresets) {
        useTaxConfigStore.getState().addPreset({
          name: preset.name,
          rate: preset.rate,
          isDefault: false, // Don't override existing default
        });
      }
    }

    return {
      success: true,
      imported: {
        clients: newClients.length,
        documents: newDocuments.length,
        templates: newTemplates.length,
        recurringRules: newRules.length,
      },
    };
  } catch (error) {
    console.error('Import error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during import',
    };
  }
};

/**
 * Get backup statistics
 */
export const getBackupStats = () => {
  return {
    clients: useClientStore.getState().clients.length,
    documents: useDocumentStore.getState().documents.length,
    templates: useTemplateStore.getState().templates.length,
    recurringRules: useRecurringStore.getState().rules.length,
    hasBusinessProfile: useBusinessProfileStore.getState().profile !== null,
  };
};
