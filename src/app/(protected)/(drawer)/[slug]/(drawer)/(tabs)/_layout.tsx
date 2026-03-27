import { Slot } from 'expo-router';

import { Platform } from 'react-native';

import ProjectTabs from '@/components/project-tabs';

export default function ProjectTabsLayout() {
  return Platform.OS === 'web' ? <Slot /> : <ProjectTabs />;
}
