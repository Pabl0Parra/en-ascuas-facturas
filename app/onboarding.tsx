import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingNavigator } from '../src/components/onboarding/OnboardingNavigator';
import { useTheme } from '../src/hooks/useTheme';
import type { AppColors } from '../src/constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleComplete = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <OnboardingNavigator onComplete={handleComplete} />
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
