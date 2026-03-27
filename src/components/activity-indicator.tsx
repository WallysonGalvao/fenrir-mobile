import { memo } from 'react';

import type { ActivityIndicatorProps } from 'react-native';
import { ActivityIndicator as RNActivityIndicator } from 'react-native';

import { test_id } from '@/constants/test-id';
import { useTheme } from '@/hooks/use-theme';

export const ActivityIndicator = memo(({ ...props }: ActivityIndicatorProps) => {
  const theme = useTheme();

  return (
    <RNActivityIndicator
      testID={test_id['activity-indicator']}
      color={theme.primary}
      size="small"
      {...props}
    />
  );
});
