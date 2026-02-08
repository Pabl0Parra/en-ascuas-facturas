import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header } from '../../src/components/ui/Header';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useBusinessProfileStore } from '../../src/stores/businessProfileStore';
import { COLORS, SPACING } from '../../src/constants/theme';

export default function BusinessProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { profile, updateProfile } = useBusinessProfileStore();

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [taxIdLabel, setTaxIdLabel] = useState('');
  const [taxId, setTaxId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');

  // Load profile data on mount
  useEffect(() => {
    if (profile) {
      setCompanyName(profile.companyName || '');
      setAddress(profile.address || '');
      setCity(profile.city || '');
      setRegion(profile.region || '');
      setPostalCode(profile.postalCode || '');
      setCountry(profile.country || '');
      setTaxIdLabel(profile.taxIdLabel || '');
      setTaxId(profile.taxId || '');
      setPaymentMethod(profile.paymentMethod || '');
      setPaymentDetails(profile.paymentDetails || '');
    }
  }, [profile]);

  const handleSave = () => {
    // Validation
    if (!companyName.trim()) {
      Alert.alert(
        t('errors.validation'),
        t('settings.businessProfile.companyName') + ' is required'
      );
      return;
    }

    // Update profile
    updateProfile({
      companyName: companyName.trim(),
      address: address.trim(),
      city: city.trim(),
      region: region.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      taxIdLabel: taxIdLabel.trim(),
      taxId: taxId.trim(),
      paymentMethod: paymentMethod.trim(),
      paymentDetails: paymentDetails.trim(),
    });

    Alert.alert(
      t('success.guardado'),
      t('settings.businessProfile.saved'),
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={t('settings.businessProfile.title')}
        showBack
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={150}
        >
          {/* Company Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('onboarding.businessInfo.title')}
            </Text>

            <Input
              label={t('settings.businessProfile.companyName')}
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Acme Inc."
              autoCapitalize="words"
              required
            />

            <Input
              label={t('settings.businessProfile.address')}
              value={address}
              onChangeText={setAddress}
              placeholder="123 Main Street"
              autoCapitalize="words"
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  label={t('settings.businessProfile.city')}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Madrid"
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  label={t('settings.businessProfile.postalCode')}
                  value={postalCode}
                  onChangeText={setPostalCode}
                  placeholder="28001"
                  keyboardType="default"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  label={t('settings.businessProfile.region')}
                  value={region}
                  onChangeText={setRegion}
                  placeholder="Madrid"
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  label={t('settings.businessProfile.country')}
                  value={country}
                  onChangeText={setCountry}
                  placeholder="ES"
                  autoCapitalize="characters"
                  maxLength={2}
                />
              </View>
            </View>
          </View>

          {/* Tax Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('settings.taxConfiguration.title')}
            </Text>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  label={t('settings.businessProfile.taxIdLabel')}
                  value={taxIdLabel}
                  onChangeText={setTaxIdLabel}
                  placeholder="NIF"
                  autoCapitalize="characters"
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  label={t('settings.businessProfile.taxId')}
                  value={taxId}
                  onChangeText={setTaxId}
                  placeholder="12345678Z"
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </View>

          {/* Payment Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('payment.metodoPago')}
            </Text>

            <Input
              label={t('settings.businessProfile.paymentMethod')}
              value={paymentMethod}
              onChangeText={setPaymentMethod}
              placeholder="Bank Transfer"
              autoCapitalize="words"
            />

            <Input
              label={t('settings.businessProfile.paymentDetails')}
              value={paymentDetails}
              onChangeText={setPaymentDetails}
              placeholder="ES12 1234 1234 1234 1234"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleSave}
              variant="primary"
            >
              {t('settings.businessProfile.save')}
            </Button>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 180 : 150,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfWidth: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: SPACING.lg,
  },
});
