import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingNavigator } from '../src/components/onboarding/OnboardingNavigator';
import { COLORS } from '../src/constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleComplete = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <OnboardingNavigator onComplete={handleComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
