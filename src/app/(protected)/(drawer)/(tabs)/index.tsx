import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { FlatList, Text, View } from 'react-native';

import { ActivityIndicator } from '@/components/activity-indicator';
import { SafeAreaView } from '@/components/safe-area-view';
import { getAllProjects } from '@/lib/supabase/projects';
import type { Project } from '@/types/project';

export default function HomeScreen() {
  const { t } = useTranslation();

  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects,
  });

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
    <SafeAreaView className="flex-1 bg-background">
      <View className="max-w-[800px] flex-1 px-6 pb-safe-offset-0">
        <View className="py-6">
          <Text className="text-3xl font-semibold text-foreground">{t('home.title')}</Text>
        </View>

        {error ? (
          <View className="mb-4 rounded-lg bg-background-element px-4 py-2">
            <Text className="text-sm text-error">{error.message}</Text>
          </View>
        ) : null}

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
    </SafeAreaView>
  );
}
