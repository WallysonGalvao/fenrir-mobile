import { lazy } from 'react';

const ProjectDashboardScreen = lazy(() => import('@/features/project/dashboard'));

export default function ProjectDashboardRoute() {
  return <ProjectDashboardScreen />;
}
