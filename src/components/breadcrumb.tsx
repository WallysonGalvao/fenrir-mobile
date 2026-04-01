import { type Href, usePathname, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';

import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type BreadcrumbEntry = {
  label: string;
  href?: Href;
};

function formatSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function useBreadcrumbs(): BreadcrumbEntry[] {
  const pathname = usePathname();
  const { t } = useTranslation();

  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return [{ label: t('home.title') }];
  }

  if (segments[0] === 'explore') {
    return [{ label: t('explore.title') }];
  }

  const slug = segments[0];
  const page = segments[1];

  const pageLabels: Record<string, string> = {
    dashboard: t('tabs.dashboard'),
    settings: t('tabs.settings'),
  };

  if (page) {
    return [
      { label: formatSlug(slug), href: `/${slug}/dashboard` as Href },
      { label: pageLabels[page] ?? formatSlug(page) },
    ];
  }

  return [{ label: formatSlug(slug) }];
}

type BreadcrumbProps = {
  entries: BreadcrumbEntry[];
};

export function Breadcrumb({ entries }: BreadcrumbProps) {
  const colors = useTheme();
  const router = useRouter();

  return (
    <View className="flex-row items-center gap-1.5">
      {entries.map((item, index) => {
        const isLast = index === entries.length - 1;
        return (
          <View key={index} className="flex-row items-center gap-1.5">
            {index > 0 && (
              <SymbolView
                name={{
                  ios: 'chevron.right',
                  android: 'chevron_right',
                  web: 'chevron_right',
                }}
                size={12}
                tintColor={colors.textSecondary}
              />
            )}
            {isLast || !item.href ? (
              <Text className="text-sm font-semibold text-foreground">{item.label}</Text>
            ) : (
              <Pressable
                onPress={() => router.push(item.href!)}
                accessibilityRole="link"
                accessibilityLabel={item.label}
                accessibilityHint={item.label}
              >
                <Text className="text-sm text-foreground-secondary web:hover:text-foreground">
                  {item.label}
                </Text>
              </Pressable>
            )}
          </View>
        );
      })}
    </View>
  );
}
