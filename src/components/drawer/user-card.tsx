import { useCallback } from 'react';

import type { Session } from '@supabase/supabase-js';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';

import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/stores/auth';

type DrawerUserCardProps = {
  isCollapsed?: boolean;
  onSignOut?: () => void;
};

function getUserInfo(session: Session | null) {
  const userEmail = session?.user?.email ?? '';
  const userName = session?.user?.user_metadata?.full_name ?? userEmail.split('@')[0] ?? '';
  const userInitials = userName
    ? userName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part: string) => part.charAt(0).toUpperCase())
        .join('')
    : 'F';

  return { userEmail, userName, userInitials };
}

export function DrawerUserCard({ isCollapsed = false, onSignOut }: DrawerUserCardProps) {
  const { t } = useTranslation();
  const colors = useTheme();
  const session = useSession((state) => state.session);
  const signOut = useSession((state) => state.signOut);

  const { userEmail, userName, userInitials } = getUserInfo(session);

  const handleSignOut = useCallback(async () => {
    await signOut();
    onSignOut?.();
  }, [onSignOut, signOut]);

  return (
    <View
      className={`rounded-3xl border border-border bg-background px-3 py-3 ${
        isCollapsed ? 'items-center' : 'gap-3'
      }`}
    >
      <View className={`flex-row items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary">
          <Text className="text-sm font-bold text-primary-foreground">{userInitials}</Text>
        </View>

        {!isCollapsed ? (
          <View className="flex-1">
            <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
              {userName}
            </Text>
            <Text className="text-xs text-foreground-secondary" numberOfLines={1}>
              {userEmail}
            </Text>
          </View>
        ) : null}
      </View>

      <Pressable
        onPress={() => void handleSignOut()}
        className={`rounded-xl bg-background-element px-3 py-3 active:opacity-80 ${
          isCollapsed
            ? 'h-11 w-11 items-center justify-center px-0 py-0'
            : 'flex-row items-center justify-center gap-2'
        }`}
        accessibilityRole="button"
        accessibilityLabel={t('drawer.actions.signOut')}
        accessibilityHint={t('drawer.hints.signOut')}
      >
        <SymbolView
          name={{
            ios: 'rectangle.portrait.and.arrow.right',
            android: 'logout',
            web: 'logout',
          }}
          size={18}
          tintColor={colors.text}
        />
        {!isCollapsed ? (
          <Text className="text-sm font-semibold text-foreground">
            {t('drawer.actions.signOut')}
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
}
