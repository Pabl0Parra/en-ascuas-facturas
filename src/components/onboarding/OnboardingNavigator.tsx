import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WelcomeStep } from './WelcomeStep';
import { BusinessInfoStep } from './BusinessInfoStep';
import { BrandingStep } from './BrandingStep';
import { FinancialStep } from './FinancialStep';
import { NumberingStep } from './NumberingStep';
import { ReviewStep } from './ReviewStep';
import { useBusinessProfileStore } from '../../stores/businessProfileStore';
import { getCountryDefaults } from '../../config/countryDefaults';
import { generateSecureId } from '../../utils/idGenerator';
import type { BusinessProfile } from '../../types/businessProfile';
import { COLORS } from '../../constants/theme';

interface OnboardingNavigatorProps {
  onComplete: () => void;
}

export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { setProfile, completeOnboarding } = useBusinessProfileStore();

  // Accumulate data from all steps
  const [onboardingData, setOnboardingData] = useState<Partial<BusinessProfile>>({
    preferredTemplate: 'classic',
  });

  const handleWelcomeNext = (language: string) => {
    setOnboardingData((prev) => ({ ...prev, locale: `${language}-${language.toUpperCase()}` }));
    setCurrentStep(1);
  };

  const handleBusinessInfoNext = (data: any) => {
    const countryDefaults = getCountryDefaults(data.country);

    setOnboardingData((prev) => ({
      ...prev,
      companyName: data.companyName,
      address: data.address,
      postalCode: data.postalCode,
      city: data.city,
      region: data.region,
      country: data.country,
      taxIdLabel: data.taxIdLabel,
      taxId: data.taxId,
      // Auto-fill from country defaults
      currency: countryDefaults.currency,
      locale: countryDefaults.locale,
      defaultTaxRate: countryDefaults.defaultTaxRate,
      taxName: countryDefaults.taxName,
      invoicePrefix: countryDefaults.invoicePrefix,
      quotePrefix: countryDefaults.quotePrefix,
    }));
    setCurrentStep(2);
  };

  const handleBrandingNext = (data: any) => {
    setOnboardingData((prev) => ({
      ...prev,
      logoUri: data.logoUri,
      primaryColor: data.primaryColor,
    }));
    setCurrentStep(3);
  };

  const handleFinancialNext = (data: any) => {
    setOnboardingData((prev) => ({
      ...prev,
      currency: data.currency,
      defaultTaxRate: data.defaultTaxRate,
      taxName: data.taxName,
      paymentMethod: data.paymentMethod,
      paymentDetails: data.paymentDetails,
    }));
    setCurrentStep(4);
  };

  const handleNumberingNext = (data: any) => {
    setOnboardingData((prev) => ({
      ...prev,
      invoicePrefix: data.invoicePrefix,
      quotePrefix: data.quotePrefix,
      nextInvoiceNumber: data.nextInvoiceNumber,
      nextQuoteNumber: data.nextQuoteNumber,
    }));
    setCurrentStep(5);
  };

  const handleComplete = () => {
    const now = new Date().toISOString();

    const profile: BusinessProfile = {
      id: generateSecureId(),
      companyName: onboardingData.companyName || '',
      address: onboardingData.address || '',
      postalCode: onboardingData.postalCode || '',
      city: onboardingData.city || '',
      region: onboardingData.region || '',
      country: onboardingData.country || 'US',
      taxIdLabel: onboardingData.taxIdLabel || 'Tax ID',
      taxId: onboardingData.taxId || '',
      paymentMethod: onboardingData.paymentMethod || 'Bank Transfer',
      paymentDetails: onboardingData.paymentDetails || '',
      logoUri: onboardingData.logoUri || null,
      primaryColor: onboardingData.primaryColor || '#FF4500',
      currency: onboardingData.currency || 'USD',
      locale: onboardingData.locale || 'en-US',
      defaultTaxRate: onboardingData.defaultTaxRate ?? 0,
      taxName: onboardingData.taxName || 'Tax',
      invoicePrefix: onboardingData.invoicePrefix || 'INV-',
      quotePrefix: onboardingData.quotePrefix || 'QUO-',
      nextInvoiceNumber: onboardingData.nextInvoiceNumber ?? 1,
      nextQuoteNumber: onboardingData.nextQuoteNumber ?? 1,
      preferredTemplate: 'classic',
      createdAt: now,
      updatedAt: now,
    };

    // Save to store
    setProfile(profile);
    completeOnboarding();

    // Navigate to main app
    onComplete();
  };

  const handleEdit = (step: number) => {
    setCurrentStep(step);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      {currentStep === 0 && (
        <WelcomeStep onNext={handleWelcomeNext} />
      )}

      {currentStep === 1 && (
        <BusinessInfoStep
          initialData={onboardingData}
          onNext={handleBusinessInfoNext}
          onBack={handleBack}
        />
      )}

      {currentStep === 2 && (
        <BrandingStep
          initialData={onboardingData}
          onNext={handleBrandingNext}
          onBack={handleBack}
        />
      )}

      {currentStep === 3 && (
        <FinancialStep
          initialData={onboardingData}
          countryCode={onboardingData.country || 'US'}
          onNext={handleFinancialNext}
          onBack={handleBack}
        />
      )}

      {currentStep === 4 && (
        <NumberingStep
          initialData={onboardingData}
          onNext={handleNumberingNext}
          onBack={handleBack}
        />
      )}

      {currentStep === 5 && (
        <ReviewStep
          profileData={onboardingData}
          onEdit={handleEdit}
          onComplete={handleComplete}
          onBack={handleBack}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
