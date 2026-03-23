import * as Sentry from '@sentry/react-native';
import { CancelledError, MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

import { FIVE_MINUTES_IN_MS, ONE_WEEK_IN_MS } from '@/constants';
import { errorToast } from '@/utils/error/toast';

import { createMMKVPersister } from './mmkv-persister';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default cache: 24 hours
      gcTime: 1000 * 60 * 60 * 24,
      // Consider data "fresh" for 5 minutes
      staleTime: FIVE_MINUTES_IN_MS,
      // Retry only on network errors
      retry: (failureCount: number, error: Error) => {
        if (error instanceof Error && error.message.includes('Network')) {
          return failureCount < 2;
        }
        return false;
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error: Error, query) => {
      if (error instanceof CancelledError) return;
      Sentry.captureException(error, {
        tags: {
          type: 'query',
          queryHash: query.queryHash,
        },
        extra: {
          queryKey: JSON.stringify(query.queryKey),
          meta: query.meta,
          queryState: query.state,
        },
      });
      errorToast(JSON.stringify(query.queryKey), error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: Error, variables, context, mutation) => {
      if (error instanceof CancelledError) return;
      Sentry.captureException(error, {
        tags: {
          type: 'mutation',
          mutationId: mutation.mutationId,
        },
        extra: {
          mutationKey: JSON.stringify(mutation.options?.mutationKey),
          meta: mutation.meta,
          variables,
          context,
        },
      });
      errorToast(JSON.stringify(mutation.options?.mutationKey), error);
    },
  }),
});

// MMKV cache persistence
const mmkvPersister = createMMKVPersister();

persistQueryClient({
  queryClient,
  persister: mmkvPersister,
  maxAge: ONE_WEEK_IN_MS, // 7 days
  buster: 'v0.0.1', // Update when there are breaking changes in data structure
});

export { queryClient };
