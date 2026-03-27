import { lazy } from 'react';

const ProjectSettingsScreen = lazy(() => import('@/features/project/settings'));

export default function ProjectSettingsRoute() {
  return <ProjectSettingsScreen />;
}
