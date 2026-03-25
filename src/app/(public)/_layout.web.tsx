import { Slot } from 'expo-router';

import { AuthLayout } from '@/components/layout/auth-layout';

export default function PublicWebLayout() {
  return (
    <AuthLayout>
      <Slot />
    </AuthLayout>
  );
}
