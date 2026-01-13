import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
}

export const AnimatedSplash: React.FC<AnimatedSplashProps> = ({
  onAnimationComplete,
}) => {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // After delay, fade out and navigate
    const timeout = setTimeout(() => {
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onAnimationComplete();
      });
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      {/* Full screen background image */}
      <Animated.Image
        source={require('../../../assets/images/splash_bg.jpg')} // Replace with your image
        style={[styles.backgroundImage, { opacity: fadeIn }]}
        resizeMode="cover"
      />

      {/* Title at top */}
      <Animated.View style={[styles.titleContainer, { opacity: fadeIn }]}>
        <Text style={styles.title}>{STRINGS.app.name.toUpperCase()}</Text>
        <Text style={styles.tagline}>{STRINGS.app.tagline}</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 80,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.background,
    letterSpacing: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '400',
    color: COLORS.background,
    letterSpacing: 3,
    marginTop: SPACING.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
