import React, { useRef } from 'react';
import { PanResponder, View, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

const TAB_PATHNAMES = ['/', '/clientes', '/historial', '/settings'];
const TAB_ROUTES = ['/(tabs)', '/(tabs)/clientes', '/(tabs)/historial', '/(tabs)/settings'];

const SWIPE_DISTANCE = 50;
const VELOCITY_THRESHOLD = 0.3;

interface Props {
  children: React.ReactNode;
}

export function SwipeableTabScreen({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) => {
        // Only claim gesture if horizontal movement is dominant and significant
        return Math.abs(dx) > Math.abs(dy) * 2 && Math.abs(dx) > 25;
      },
      onPanResponderRelease: (_, { dx, vx }) => {
        const currentIndex = TAB_PATHNAMES.indexOf(pathnameRef.current);
        if (currentIndex === -1) return;

        const isSwipeLeft = dx < -SWIPE_DISTANCE || (vx < -VELOCITY_THRESHOLD && dx < -20);
        const isSwipeRight = dx > SWIPE_DISTANCE || (vx > VELOCITY_THRESHOLD && dx > 20);

        if (isSwipeLeft && currentIndex < TAB_PATHNAMES.length - 1) {
          router.navigate(TAB_ROUTES[currentIndex + 1] as any);
        } else if (isSwipeRight && currentIndex > 0) {
          router.navigate(TAB_ROUTES[currentIndex - 1] as any);
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
