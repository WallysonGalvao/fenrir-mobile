import { memo } from 'react';

import type { ActivityIndicatorProps } from 'react-native';
import { ActivityIndicator as RNActivityIndicator } from 'react-native';

import { test_id } from '@/constants/test-id';
import { Colors } from '@/constants/theme';

export const ActivityIndicator = memo(({ ...props }: ActivityIndicatorProps) => {
  return (
    <RNActivityIndicator
      testID={test_id['activity-indicator']}
      color={Colors.light.primary}
      size="small"
      {...props}
    />
  );
});
