import { lazy } from 'react';

const HomeScreen = lazy(() => import('@/features/home'));

export default function HomeRoute() {
  return <HomeScreen />;
}
