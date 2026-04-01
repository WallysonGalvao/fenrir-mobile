import { useGlobalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ScrollView, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { SafeAreaView } from '@/components/safe-area-view';

export default function ProjectSettingsScreen() {
  const { t } = useTranslation();
  const { slug } = useGlobalSearchParams<{ slug: string }>();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title={t('project.settings')} />
      <ScrollView
        contentContainerClassName="gap-6 px-6 py-6 pb-safe-offset-6 web:px-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-240 gap-6 self-center web:w-full">
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">{t('project.settings')}</Text>
            <Text className="text-sm text-foreground-secondary">{slug}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
