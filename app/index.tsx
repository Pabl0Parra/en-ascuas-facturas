// app/index.tsx
import  { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AnimatedSplash } from '../src/components/splash/AnimatedSplash';
import { useTheme } from '../src/hooks/useTheme';
import type { AppColors } from '../src/constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleAnimationComplete = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <AnimatedSplash onAnimationComplete={handleAnimationComplete} />
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
