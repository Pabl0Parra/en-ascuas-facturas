import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { MigrationService } from '../src/services/migrationService';
import { useBusinessProfileStore } from '../src/stores/businessProfileStore';
import { WhatsNewScreen } from '../src/components/migration/WhatsNewScreen';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { initI18n } from '../src/i18n';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { migration } = useBusinessProfileStore();
  const [isReady, setIsReady] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    async function initializeApp() {
      try {
        console.log('🚀 Initializing app...');

        // Initialize i18n first (loads saved language or device locale)
        await initI18n();
        console.log('✅ i18n initialized');

        // Check if onboarding is required
        const needsOnboarding = await MigrationService.shouldShowOnboarding();
        console.log('📋 Needs onboarding:', needsOnboarding);

        // Check if user was migrated from legacy
        const wasMigrated = MigrationService.hasMigratedFromLegacy();
        console.log('🔄 Was migrated:', wasMigrated);

        if (needsOnboarding) {
          // Fresh install - navigate to onboarding
          console.log('➡️ Navigating to onboarding');
          setTimeout(() => {
            router.replace('/onboarding');
          }, 100);
        } else if (wasMigrated) {
          // Existing user - show What's New modal
          setShowWhatsNew(true);
        }

        setIsReady(true);
      } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        // Even if initialization fails, show onboarding as a safe fallback
        setIsReady(true);
        setTimeout(() => {
          router.replace('/onboarding');
        }, 100);
      }
    }

    initializeApp();
  }, []);

  useEffect(() => {
    if (fontsLoaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isReady]);

  const handleWhatsNewClose = () => {
    setShowWhatsNew(false);
    MigrationService.markWhatsNewSeen();
  };

  if (!fontsLoaded || !isReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
        <WhatsNewScreen visible={showWhatsNew} onClose={handleWhatsNewClose} />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
