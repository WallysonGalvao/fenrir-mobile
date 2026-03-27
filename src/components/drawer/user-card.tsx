import { useCallback } from 'react';

import type { Session } from '@supabase/supabase-js';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import * as DropdownMenu from 'zeego/dropdown-menu';

import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/stores/auth';

type DrawerUserCardProps = {
  isCollapsed?: boolean;
};

const DropdownContent = DropdownMenu.create(
  (props: React.ComponentProps<typeof DropdownMenu.Content>) => (
    <DropdownMenu.Content
      {...props}
      side="right"
      sideOffset={8}
      align="start"
      className="z-50 min-w-45 overflow-hidden rounded-xl border border-border bg-background p-1 shadow-lg"
    />
  ),
  'Content',
);

const DropdownItem = DropdownMenu.create(
  ({ destructive, ...props }: React.ComponentProps<typeof DropdownMenu.Item>) => (
    <DropdownMenu.Item
      {...props}
      destructive={destructive}
      className={`relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-background-element focus:bg-background-element data-disabled:pointer-events-none data-disabled:opacity-50 ${
        destructive ? 'text-error' : 'text-foreground'
      }`}
    />
  ),
  'Item',
);

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

export function DrawerUserCard({ isCollapsed = false }: DrawerUserCardProps) {
  const { t } = useTranslation();
  const colors = useTheme();
  const session = useSession((state) => state.session);
  const signOut = useSession((state) => state.signOut);

  const { userEmail, userName, userInitials } = getUserInfo(session);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, [signOut]);

  if (isCollapsed) {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Pressable
            className="h-11 w-11 items-center justify-center rounded-full bg-primary active:opacity-80 web:hover:opacity-90"
            accessibilityRole="button"
            accessibilityLabel={t('drawer.actions.openUserMenu')}
            accessibilityHint={t('drawer.hints.openUserMenu')}
          >
            <Text className="text-sm font-bold text-primary-foreground">{userInitials}</Text>
          </Pressable>
        </DropdownMenu.Trigger>

        <DropdownContent>
          <DropdownItem key="sign-out" destructive onSelect={handleSignOut}>
            <DropdownMenu.ItemIcon
              ios={{ name: 'rectangle.portrait.and.arrow.right' }}
              androidIconName="logout"
            />
            <DropdownMenu.ItemTitle>{t('drawer.actions.signOut')}</DropdownMenu.ItemTitle>
          </DropdownItem>
        </DropdownContent>
      </DropdownMenu.Root>
    );
  }

  return (
    <View className="flex-row items-center gap-3 web:hover:bg-foreground/5 rounded-xl px-3 py-2.5">
      <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
        <Text className="text-sm font-bold text-primary-foreground">{userInitials}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
          {userName}
        </Text>
        <Text className="text-xs text-foreground-secondary" numberOfLines={1}>
          {userEmail}
        </Text>
      </View>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Pressable
            className="h-8 w-8 items-center justify-center rounded-lg active:bg-background-element active:opacity-80 "
            accessibilityRole="button"
            accessibilityLabel={t('drawer.actions.openUserMenu')}
            accessibilityHint={t('drawer.hints.openUserMenu')}
          >
            <SymbolView
              name={{ ios: 'ellipsis', android: 'more_vert', web: 'more_vert' }}
              size={18}
              tintColor={colors.text}
            />
          </Pressable>
        </DropdownMenu.Trigger>

        <DropdownContent>
          <DropdownItem key="sign-out" destructive onSelect={handleSignOut}>
            <DropdownMenu.ItemIcon
              ios={{ name: 'rectangle.portrait.and.arrow.right' }}
              androidIconName="logout"
            />
            <DropdownMenu.ItemTitle>{t('drawer.actions.signOut')}</DropdownMenu.ItemTitle>
          </DropdownItem>
        </DropdownContent>
      </DropdownMenu.Root>
    </View>
  );
}
