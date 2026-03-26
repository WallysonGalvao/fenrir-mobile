import { useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FlatList, StyleSheet, View } from 'react-native';

import { ActivityIndicator } from '@/components/activity-indicator';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getAllProjects } from '@/lib/supabase/projects';
import type { Project } from '@/types/project';

export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const renderProject = useCallback(
    ({ item }: { item: Project }) => (
      <ThemedView type="backgroundElement" style={styles.projectCard}>
        <View style={styles.projectHeader}>
          <View style={[styles.projectAvatar, { backgroundColor: theme.primary }]}>
            <ThemedText style={styles.projectAvatarText}>
              {item.name.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <View style={styles.projectInfo}>
            <ThemedText type="default" style={styles.projectName}>
              {item.name}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {item.slug}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {new Date(item.created_at).toLocaleDateString()}
        </ThemedText>
      </ThemedView>
    ),
    [theme],
  );

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <ThemedText type="default" themeColor="textSecondary">
          {t('home.noProjects', { defaultValue: 'No projects yet' })}
        </ThemedText>
      </View>
    );
  }, [loading, t]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerSection}>
          <ThemedText type="subtitle">{t('home.title')}</ThemedText>
        </View>

        {error ? (
          <ThemedView type="backgroundElement" style={styles.errorContainer}>
            <ThemedText type="small" style={{ color: '#ef4444' }}>
              {error}
            </ThemedText>
          </ThemedView>
        ) : null}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={projects}
            renderItem={renderProject}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmpty}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    paddingBottom: BottomTabInset,
  },
  headerSection: {
    paddingVertical: Spacing.four,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    marginBottom: Spacing.three,
  },
  listContent: {
    gap: Spacing.two,
    paddingBottom: Spacing.four,
  },
  projectCard: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    flex: 1,
  },
  projectAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  projectInfo: {
    flex: 1,
    gap: 2,
  },
  projectName: {
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.six,
  },
});
