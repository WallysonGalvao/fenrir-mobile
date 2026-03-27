import type { Action } from 'expo-quick-actions';
import type { TFunction } from 'i18next';

import { Platform } from 'react-native';

const isAndroid = Platform.OS === 'android';

export const getQuickActions = (t: TFunction): Action[] => [
  // {
  //   id: 'new-alarm',
  //   title: t('quickAction.newAlarm'),
  //   icon: isAndroid ? 'shortcut_new_alarm' : 'alarm',
  //   params: { href: '/alarm/create-alarm' },
  // },
  // {
  //   id: 'dashboard',
  //   title: t('quickAction.dashboard'),
  //   icon: isAndroid ? 'shortcut_dashboard' : 'symbol:chart.bar.xaxis.ascending',
  //   params: { href: '/(tabs)/dashboard' },
  // },
  // {
  //   id: 'achievements',
  //   title: t('quickAction.achievements'),
  //   icon: isAndroid ? 'shortcut_achievements' : 'symbol:trophy.fill',
  //   params: { href: '/achievements' },
  // },
  // {
  //   id: 'settings',
  //   title: t('quickAction.settings'),
  //   icon: isAndroid ? 'shortcut_settings' : 'symbol:gearshape.fill',
  //   params: { href: '/(tabs)/settings' },
  // },
  {
    id: 'feedback',
    title: t('quickAction.feedback'),
    subtitle: t('quickAction.feedback.subtitle'),
    icon: isAndroid ? 'shortcut_feedback' : 'symbol:envelope',
    params: { href: 'mailto:wallyson.galvao@gmail.com' },
  },
];
