// app/index.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AnimatedSplash } from '../src/components/splash/AnimatedSplash';
import { COLORS } from '../src/constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  
  const handleAnimationComplete = () => {
    router.replace('/(tabs)');
  };
  
  return (
    <View style={styles.container}>
      <AnimatedSplash onAnimationComplete={handleAnimationComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});