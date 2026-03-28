import { useEffect } from 'react';

import * as QuickActions from 'expo-quick-actions';
import { useTranslation } from 'react-i18next';

import { getQuickActions } from './constants';

export const useQuickActions = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const setupQuickActions = async () => {
      const isSupported = await QuickActions.isSupported();
      if (!isSupported) {
        return;
      }

      // Obter limite máximo (iOS: 4, Android: varia por device)
      const maxCount = QuickActions.maxCount;

      const actions = getQuickActions(t);
      const limit = maxCount ?? actions.length;

      // feedback is always the last item and must always be shown
      const feedback = actions.find((a) => a.id === 'feedback');
      const rest = actions.filter((a) => a.id !== 'feedback');
      const limitedRest = rest.slice(0, feedback ? limit - 1 : limit);
      const limitedActions = feedback ? [...limitedRest, feedback] : limitedRest;

      await QuickActions.setItems(limitedActions);
    };

    setupQuickActions();
  }, [t]);

  return {
    maxCount: QuickActions.maxCount,
    isSupported: QuickActions.isSupported,
  };
};
