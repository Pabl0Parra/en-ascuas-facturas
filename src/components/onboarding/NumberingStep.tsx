import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';

interface NumberingData {
  invoicePrefix: string;
  quotePrefix: string;
  nextInvoiceNumber: number;
  nextQuoteNumber: number;
}

interface NumberingStepProps {
  initialData?: Partial<NumberingData>;
  onNext: (data: NumberingData) => void;
  onBack: () => void;
}

export const NumberingStep: React.FC<NumberingStepProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [formData, setFormData] = useState<NumberingData>({
    invoicePrefix: initialData?.invoicePrefix || 'INV-',
    quotePrefix: initialData?.quotePrefix || 'QUO-',
    nextInvoiceNumber: initialData?.nextInvoiceNumber ?? 1,
    nextQuoteNumber: initialData?.nextQuoteNumber ?? 1,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof NumberingData, string>>>({});

  const handleChange = (field: keyof NumberingData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NumberingData, string>> = {};

    if (!formData.invoicePrefix.trim()) {
      newErrors.invoicePrefix = 'Invoice prefix is required';
    }

    if (!formData.quotePrefix.trim()) {
      newErrors.quotePrefix = 'Quote prefix is required';
    }

    if (formData.nextInvoiceNumber < 1) {
      newErrors.nextInvoiceNumber = 'Must be at least 1';
    }

    if (formData.nextQuoteNumber < 1) {
      newErrors.nextQuoteNumber = 'Must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onNext(formData);
    }
  };

  const formatNumber = (num: number): string => {
    return String(num).padStart(4, '0');
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
        <Text style={styles.title}>Document Numbering</Text>
        <Text style={styles.subtitle}>
          Configure how your invoices and quotes are numbered
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Numbering</Text>

          <Input
            label="Invoice Prefix"
            value={formData.invoicePrefix}
            onChangeText={(value) => handleChange('invoicePrefix', value)}
            placeholder="INV-"
            error={errors.invoicePrefix}
          />

          <Input
            label="Starting Number"
            value={formData.nextInvoiceNumber.toString()}
            onChangeText={(value) => {
              const num = parseInt(value, 10) || 1;
              handleChange('nextInvoiceNumber', num);
            }}
            keyboardType="number-pad"
            placeholder="1"
            error={errors.nextInvoiceNumber}
          />

          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Preview:</Text>
            <Text style={styles.previewText}>
              {formData.invoicePrefix}{formatNumber(formData.nextInvoiceNumber)}
            </Text>
            <Text style={styles.previewSub}>Next invoice will be numbered this way</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quote Numbering</Text>

          <Input
            label="Quote Prefix"
            value={formData.quotePrefix}
            onChangeText={(value) => handleChange('quotePrefix', value)}
            placeholder="QUO-"
            error={errors.quotePrefix}
          />

          <Input
            label="Starting Number"
            value={formData.nextQuoteNumber.toString()}
            onChangeText={(value) => {
              const num = parseInt(value, 10) || 1;
              handleChange('nextQuoteNumber', num);
            }}
            keyboardType="number-pad"
            placeholder="1"
            error={errors.nextQuoteNumber}
          />

          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Preview:</Text>
            <Text style={styles.previewText}>
              {formData.quotePrefix}{formatNumber(formData.nextQuoteNumber)}
            </Text>
            <Text style={styles.previewSub}>Next quote will be numbered this way</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Tips:</Text>
          <Text style={styles.infoText}>
            Use prefixes that make sense for your business (e.g., "FACT-" for Spanish invoices)
          </Text>
          <Text style={styles.infoText}>
            Numbers will auto-increment with each new invoice or quote
          </Text>
          <Text style={styles.infoText}>
            You can change these settings later in the app
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
          <Text style={styles.progress}>Step 5 of 6</Text>
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
    paddingBottom: Platform.OS === 'ios' ? 180 : 150,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
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
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SPACING.md,
  },
  previewBox: {
    backgroundColor: colors.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  previewLabel: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: SPACING.xs,
  },
  previewText: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: SPACING.xs,
  },
  previewSub: {
    fontSize: FONT_SIZE.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: colors.primaryLight + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  infoTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
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
