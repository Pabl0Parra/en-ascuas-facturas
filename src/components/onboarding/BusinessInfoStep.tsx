import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { SPACING, FONT_SIZE } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';
import { getSupportedCountries, getCountryDefaults } from '../../config/countryDefaults';

interface BusinessInfoData {
  companyName: string;
  address: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
  taxIdLabel: string;
  taxId: string;
}

interface BusinessInfoStepProps {
  initialData?: Partial<BusinessInfoData>;
  onNext: (data: BusinessInfoData) => void;
  onBack: () => void;
}

export const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [formData, setFormData] = useState<BusinessInfoData>({
    companyName: initialData?.companyName || '',
    address: initialData?.address || '',
    postalCode: initialData?.postalCode || '',
    city: initialData?.city || '',
    region: initialData?.region || '',
    country: initialData?.country || 'ES',
    taxIdLabel: initialData?.taxIdLabel || 'NIF',
    taxId: initialData?.taxId || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BusinessInfoData, string>>>({});

  // Auto-update tax ID label when country changes
  useEffect(() => {
    const countryDefaults = getCountryDefaults(formData.country);
    setFormData((prev) => ({
      ...prev,
      taxIdLabel: countryDefaults.taxIdLabel,
    }));
  }, [formData.country]);

  const handleChange = (field: keyof BusinessInfoData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BusinessInfoData, string>> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.taxId.trim()) {
      newErrors.taxId = `${formData.taxIdLabel} is required`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onNext(formData);
    }
  };

  const countryOptions = getSupportedCountries().map((country) => ({
    label: country.name,
    value: country.code,
  }));

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
        <Text style={styles.title}>Business Information</Text>
        <Text style={styles.subtitle}>
          Tell us about your business
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Company Name *"
          value={formData.companyName}
          onChangeText={(value) => handleChange('companyName', value)}
          placeholder="Acme Corp"
          error={errors.companyName}
        />

        <Select
          label="Country *"
          options={countryOptions}
          value={formData.country}
          onChange={(value) => handleChange('country', value)}
          searchable
        />

        <Input
          label="Address *"
          value={formData.address}
          onChangeText={(value) => handleChange('address', value)}
          placeholder="123 Main Street"
          error={errors.address}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Postal Code"
              value={formData.postalCode}
              onChangeText={(value) => handleChange('postalCode', value)}
              placeholder="12345"
              error={errors.postalCode}
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="City *"
              value={formData.city}
              onChangeText={(value) => handleChange('city', value)}
              placeholder="New York"
              error={errors.city}
            />
          </View>
        </View>

        <Input
          label="State/Region"
          value={formData.region}
          onChangeText={(value) => handleChange('region', value)}
          placeholder="California"
          error={errors.region}
        />

        <Input
          label={`${formData.taxIdLabel} *`}
          value={formData.taxId}
          onChangeText={(value) => handleChange('taxId', value)}
          placeholder={
            formData.taxIdLabel === 'NIF'
              ? '12345678A'
              : formData.taxIdLabel === 'EIN'
              ? '12-3456789'
              : formData.taxIdLabel === 'VAT'
              ? 'GB123456789'
              : 'Tax ID'
          }
          error={errors.taxId}
        />

        <Text style={styles.hint}>
          Tax ID label auto-updates based on your selected country
        </Text>
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
          <Text style={styles.progress}>Step 2 of 6</Text>
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
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfWidth: {
    flex: 1,
  },
  hint: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
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
