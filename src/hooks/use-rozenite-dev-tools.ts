import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { useReactNavigationDevTools } from '@rozenite/react-navigation-plugin';
import { useTanStackQueryDevTools } from '@rozenite/tanstack-query-plugin';

import { queryClient } from '@/config/react-query';

export function useRozeniteDevTools(
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>,
) {
  useTanStackQueryDevTools(queryClient);
  useReactNavigationDevTools({ ref: navigationRef });
}
