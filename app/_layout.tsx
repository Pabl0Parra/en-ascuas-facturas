import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MigrationService } from '../src/services/migrationService';
import { useBusinessProfileStore } from '../src/stores/businessProfileStore';
import { WhatsNewScreen } from '../src/components/migration/WhatsNewScreen';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { initI18n } from '../src/i18n';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { migration } = useBusinessProfileStore();
  const [isReady, setIsReady] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

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

  const handleWhatsNewClose = () => {
    setShowWhatsNew(false);
    MigrationService.markWhatsNewSeen();
  };

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 18, color: '#333' }}>Loading...</Text>
      </View>
    );
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
