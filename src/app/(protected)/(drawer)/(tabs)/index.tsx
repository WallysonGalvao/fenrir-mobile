import { useCallback } from 'react';

import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';

import { FlatList, Text, View } from 'react-native';

import { ActivityIndicator } from '@/components/activity-indicator';
import type { IconButton } from '@/components/header';
import { Header } from '@/components/header';
import { ProtectedPageShell } from '@/components/protected-page-shell';
import { SafeAreaView } from '@/components/safe-area-view';
import { useTheme } from '@/hooks/use-theme';
import { getAllProjects } from '@/lib/supabase/projects';
import type { Project } from '@/types/project';

export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  const { openDrawer } = useNavigation<DrawerNavigationProp<Record<string, undefined>>>();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects,
  });

  const handleDrawer = useCallback(() => openDrawer(), [openDrawer]);

  const leftIcons: IconButton[] = [
    {
      icon: (
        <SymbolView
          name={{ ios: 'line.3.horizontal', android: 'menu', web: 'menu' }}
          size={22}
          tintColor={theme.text}
        />
      ),
      onPress: handleDrawer,
      accessibilityLabel: t('auth.backToLanding'),
      accessibilityHint: t('auth.backToLanding'),
    },
  ];

  const renderProject = useCallback(
    ({ item }: { item: Project }) => (
      <View className="flex-row items-center justify-between rounded-xl bg-background-element px-4 py-4">
        <View className="flex-1 flex-row items-center gap-4">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Text className="text-lg font-bold text-primary-foreground">
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-base font-semibold text-foreground">{item.name}</Text>
            <Text className="text-sm text-foreground-secondary">{item.slug}</Text>
          </View>
        </View>
        <Text className="text-sm text-foreground-secondary">
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    ),
    [],
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View className="flex-1 items-center justify-center py-16">
        <Text className="text-base text-foreground-secondary">{t('home.noProjects')}</Text>
      </View>
    );
  }, [isLoading, t]);

  return (
    <ProtectedPageShell title={t('home.title')}>
      <SafeAreaView className="flex-1 bg-transparent">
        <Header title={t('home.title')} leftIcons={leftIcons} />
        <View className="flex-1 px-6 pb-safe-offset-0 pt-6 web:px-8">
          <View className="max-w-[960px] flex-1 self-center">
            {isLoading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
              </View>
            ) : (
              <FlatList
                data={projects}
                renderItem={renderProject}
                keyExtractor={(item) => item.id}
                contentContainerClassName="gap-2 pb-6"
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </ProtectedPageShell>
  );
}
