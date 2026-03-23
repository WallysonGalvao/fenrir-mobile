import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { useMMKVDevTools } from '@rozenite/mmkv-plugin';
import { useNetworkActivityDevTools } from '@rozenite/network-activity-plugin';
import { useReactNavigationDevTools } from '@rozenite/react-navigation-plugin';
import { useTanStackQueryDevTools } from '@rozenite/tanstack-query-plugin';

import { queryClient } from '@/config/react-query';
import { queryStorage } from '@/config/react-query/mmkv-persister';

export function useRozeniteDevTools(
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>,
) {
  useTanStackQueryDevTools(queryClient);
  useReactNavigationDevTools({ ref: navigationRef });
  useNetworkActivityDevTools();
  useMMKVDevTools({
    storages: queryStorage ? { 'query-cache': queryStorage } : {},
  });
}
