import { lazy } from 'react';

const ExploreScreen = lazy(() => import('@/features/explore'));

export default function ExploreRoute() {
  return <ExploreScreen />;
}
