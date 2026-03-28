import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';

import { Pressable, ScrollView, Text, View } from 'react-native';

import { ActivityIndicator } from '@/components/activity-indicator';
import { Header } from '@/components/header';
import { SafeAreaView } from '@/components/safe-area-view';
import { useTheme } from '@/hooks/use-theme';
import { getProjectBySlug } from '@/lib/supabase/projects';

export default function ProjectDashboardScreen() {
  const { t } = useTranslation();
  const { slug } = useGlobalSearchParams<{ slug: string }>();
  const router = useRouter();
  const colors = useTheme();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => getProjectBySlug(slug),
    enabled: Boolean(slug),
  });

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const title = project?.name ?? slug;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title={title} />
      <View className="h-14 flex-row items-center gap-2 border-b border-border px-4 web:hidden">
        <Pressable
          onPress={handleBack}
          className="h-9 w-9 items-center justify-center rounded-lg active:opacity-80 web:hover:bg-foreground/5"
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          accessibilityHint={t('common.back')}
        >
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
            size={20}
            tintColor={colors.text}
          />
        </Pressable>
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
      </View>

      <ScrollView
        contentContainerClassName="gap-6 px-6 py-6 pb-safe-offset-6 web:px-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-240 gap-6 self-center web:w-full">
          {isLoading ? (
            <View className="items-center py-16">
              <ActivityIndicator size="large" />
            </View>
          ) : !project ? (
            <View className="items-center py-16 gap-3">
              <Text className="text-base font-semibold text-foreground">
                {t('project.notFound')}
              </Text>
              <Text className="text-sm text-foreground-secondary">{slug}</Text>
            </View>
          ) : (
            <>
              <View className="gap-1">
                <Text className="text-3xl font-bold text-foreground">{project.name}</Text>
                <Text className="text-sm text-foreground-secondary">{project.slug}</Text>
              </View>

              <View className="gap-4">
                <InfoCard
                  label={t('project.createdAt')}
                  value={new Date(project.created_at).toLocaleDateString()}
                  icon={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }}
                  colors={colors}
                />

                <InfoCard
                  label={t('project.repositories')}
                  value={
                    project.repositories?.length
                      ? project.repositories.map((r) => r.name).join(', ')
                      : t('project.noRepositories')
                  }
                  icon={{ ios: 'arrow.branch', android: 'account_tree', web: 'account_tree' }}
                  colors={colors}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
  icon: { ios: string; android: string; web: string };
  colors: ReturnType<typeof useTheme>;
};

function InfoCard({ label, value, icon, colors }: InfoCardProps) {
  return (
    <View className="flex-row items-center gap-4 rounded-2xl border border-border bg-background-element px-4 py-4">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-background">
        <SymbolView name={icon as never} size={20} tintColor={colors.primary} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
          {label}
        </Text>
        <Text className="text-sm font-semibold text-foreground">{value}</Text>
      </View>
    </View>
  );
}
