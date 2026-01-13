import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  SHADOWS,
  BORDER_RADIUS,
} from '../../src/constants/theme';
import { STRINGS } from '../../src/constants/strings';

export default function HomeScreen() {
  const router = useRouter();

  const handleNewDocument = (tipo: 'factura' | 'presupuesto') => {
    router.push(`/documento/nuevo?tipo=${tipo}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/images/en-ascuas-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>{STRINGS.app.name.toUpperCase()}</Text>
          <Text style={styles.tagline}>{STRINGS.app.tagline}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleNewDocument('factura')}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>
              <Ionicons
                name="document-text"
                size={32}
                color={COLORS.textInverse}
              />
            </View>
            <Text style={styles.buttonText}>
              {STRINGS.navigation.nuevaFactura}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={COLORS.textInverse}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => handleNewDocument('presupuesto')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrapper, styles.secondaryIconWrapper]}>
              <Ionicons name="clipboard" size={32} color={COLORS.primary} />
            </View>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              {STRINGS.navigation.nuevoPresupuesto}
            </Text>
            <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: SPACING.md,
  },
  appName: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: 4,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '300',
    color: COLORS.ember,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  buttonsSection: {
    gap: SPACING.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  secondaryButton: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  secondaryIconWrapper: {
    backgroundColor: COLORS.primary + '15',
  },
  buttonText: {
    flex: 1,
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.textInverse,
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
});
