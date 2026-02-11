import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { SPACING, FONT_SIZE, FONTS } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';

interface FinancialData {
  currency: string;
  defaultTaxRate: number;
  taxName: string;
  paymentMethod: string;
  paymentDetails: string;
}

interface FinancialStepProps {
  initialData?: Partial<FinancialData>;
  countryCode: string; // From BusinessInfoStep to show relevant defaults
  onNext: (data: FinancialData) => void;
  onBack: () => void;
}

const CURRENCIES = [
  { label: 'EUR (€) - Euro', value: 'EUR' },
  { label: 'USD ($) - US Dollar', value: 'USD' },
  { label: 'GBP (£) - British Pound', value: 'GBP' },
  { label: 'CAD ($) - Canadian Dollar', value: 'CAD' },
  { label: 'AUD ($) - Australian Dollar', value: 'AUD' },
  { label: 'MXN ($) - Mexican Peso', value: 'MXN' },
  { label: 'JPY (¥) - Japanese Yen', value: 'JPY' },
  { label: 'CHF (Fr) - Swiss Franc', value: 'CHF' },
];

const PAYMENT_METHODS = [
  { label: 'Bank Transfer', value: 'Bank Transfer' },
  { label: 'Cash', value: 'Cash' },
  { label: 'Check', value: 'Check' },
  { label: 'PayPal', value: 'PayPal' },
  { label: 'Credit Card', value: 'Credit Card' },
  { label: 'Other', value: 'Other' },
];

export const FinancialStep: React.FC<FinancialStepProps> = ({
  initialData,
  countryCode,
  onNext,
  onBack,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [formData, setFormData] = useState<FinancialData>({
    currency: initialData?.currency || 'EUR',
    defaultTaxRate: initialData?.defaultTaxRate ?? 21,
    taxName: initialData?.taxName || 'IVA',
    paymentMethod: initialData?.paymentMethod || 'Bank Transfer',
    paymentDetails: initialData?.paymentDetails || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FinancialData, string>>>({});

  const handleChange = (field: keyof FinancialData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FinancialData, string>> = {};

    if (!formData.taxName.trim()) {
      newErrors.taxName = 'Tax name is required';
    }

    if (formData.defaultTaxRate < 0 || formData.defaultTaxRate > 100) {
      newErrors.defaultTaxRate = 'Tax rate must be between 0 and 100';
    }

    if (!formData.paymentDetails.trim()) {
      newErrors.paymentDetails = 'Payment details are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={150}
      >
      <View style={styles.header}>
        <Text style={styles.title}>Financial Settings</Text>
        <Text style={styles.subtitle}>
          Configure your currency, tax, and payment preferences
        </Text>
      </View>

      <View style={styles.form}>
        <Select
          label="Currency *"
          options={CURRENCIES}
          value={formData.currency}
          onChange={(value) => handleChange('currency', value)}
          searchable
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Selected currency will be used for all invoices and quotes
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Tax Name *"
              value={formData.taxName}
              onChangeText={(value) => handleChange('taxName', value)}
              placeholder="VAT, GST, Sales Tax..."
              error={errors.taxName}
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Default Tax Rate (%) *"
              value={formData.defaultTaxRate.toString()}
              onChangeText={(value) => {
                const num = parseFloat(value) || 0;
                handleChange('defaultTaxRate', num);
              }}
              keyboardType="decimal-pad"
              placeholder="21"
              error={errors.defaultTaxRate}
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            You can add more tax rates later in Settings
          </Text>
        </View>

        <Select
          label="Payment Method *"
          options={PAYMENT_METHODS}
          value={formData.paymentMethod}
          onChange={(value) => handleChange('paymentMethod', value)}
        />

        <Input
          label="Payment Details *"
          value={formData.paymentDetails}
          onChangeText={(value) => handleChange('paymentDetails', value)}
          placeholder={
            formData.paymentMethod === 'Bank Transfer'
              ? 'IBAN: ES12 3456 7890 1234 5678 90'
              : formData.paymentMethod === 'PayPal'
              ? 'PayPal: your@email.com'
              : 'Account number, email, or instructions...'
          }
          error={errors.paymentDetails}
          multiline
          numberOfLines={3}
        />

        <View style={styles.exampleBox}>
          <Text style={styles.exampleTitle}>Example:</Text>
          <Text style={styles.exampleText}>
            An invoice for $1,000 with {formData.defaultTaxRate}% {formData.taxName} would total:
          </Text>
          <Text style={styles.exampleAmount}>
            ${(1000 + (1000 * formData.defaultTaxRate) / 100).toFixed(2)}
          </Text>
        </View>
      </View>

        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <View style={styles.buttonHalf}>
              <Button onPress={onBack} variant="outline" fullWidth>
                Back
              </Button>
            </View>
            <View style={styles.buttonHalf}>
              <Button onPress={handleContinue} fullWidth>
                Continue
              </Button>
            </View>
          </View>
          <Text style={styles.progress}>Step 4 of 6</Text>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  header: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfWidth: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: colors.surface,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  infoText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  exampleBox: {
    backgroundColor: colors.primaryLight + '15',
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  exampleTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semibold,
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  exampleText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: SPACING.xs,
  },
  exampleAmount: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: colors.primary,
  },
  footer: {
    marginTop: SPACING.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  buttonHalf: {
    flex: 1,
  },
  progress: {
    fontSize: FONT_SIZE.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
