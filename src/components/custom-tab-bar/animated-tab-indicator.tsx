import React, { useState } from 'react';

import Animated from 'react-native-reanimated';

import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet, View } from 'react-native';

interface AnimatedTabIndicatorProps {
  /**
   * Current tab index
   */
  currentIndex: number;

  /**
   * Number of tabs in the tab bar
   */
  tabCount: number;

  /**
   * Height of the indicator
   */
  height?: number;

  /**
   * Custom color for the indicator
   */
  color?: string;

  /**
   * Animation duration in milliseconds
   */
  duration?: number;
}

/**
 * AnimatedTabIndicator
 *
 * A smooth horizontal indicator that slides under the active tab.
 * Uses react-native-reanimated for 60fps animations.
 *
 * @example
 * ```tsx
 * <AnimatedTabIndicator
 *   currentIndex={state.index}
 *   tabCount={state.routes.length}
 * />
 * ```
 */
export function AnimatedTabIndicator({
  currentIndex,
  tabCount,
  height = 3,
  color: indicatorColor,
  duration = 200,
}: AnimatedTabIndicatorProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  // Handle layout to get container width
  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const tabWidth = containerWidth / tabCount;

  return (
    <View onLayout={handleLayout} style={[styles.container, { height }]}>
      <Animated.View
        style={[
          styles.indicator,
          {
            height,
            backgroundColor: indicatorColor,
            borderRadius: height / 2,
            width: tabWidth,
            transform: [{ translateX: currentIndex * tabWidth }],

            transitionProperty: 'transform',
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: 'ease-in-out',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  indicator: {
    // Dynamic styles applied inline
  },
});
