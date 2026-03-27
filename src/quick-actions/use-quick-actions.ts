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

      const first = actions[0];
      const last = actions[actions.length - 1];
      const middle = actions.slice(1, -1);
      const maxMiddle = (maxCount ?? actions.length) - 2;
      const limitedActions = [first, ...middle.slice(0, maxMiddle), last];

      await QuickActions.setItems(limitedActions);
    };

    setupQuickActions();
  }, [t]);

  return {
    maxCount: QuickActions.maxCount,
    isSupported: QuickActions.isSupported,
  };
};
