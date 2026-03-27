import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { Pressable, Text } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { getAllProjects } from '@/lib/supabase/projects';
import type { Project } from '@/types/project';

import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from '../menu';

type ProjectSwitcherProps = {
  currentSlug: string;
  isCollapsed?: boolean;
};

export function ProjectSwitcher({ currentSlug, isCollapsed = false }: ProjectSwitcherProps) {
  const router = useRouter();
  const colors = useTheme();

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects,
  });

  const currentProject = projects.find((p) => p.slug === currentSlug);
  const displayName = currentProject?.name ?? currentSlug;

  const handleSelectProject = useCallback(
    (project: Project) => {
      router.push(`/${project.slug}/dashboard`);
    },
    [router],
  );

  const handleNewProject = useCallback(() => {
    router.push('/new-project');
  }, [router]);

  const menuItems = (
    <>
      {projects.map((project) => (
        <MenuItem
          key={project.id}
          textValue={project.name}
          onPress={() => handleSelectProject(project)}
        >
          <MenuItemLabel>{project.name}</MenuItemLabel>
          {project.slug === currentSlug ? (
            <SymbolView
              name={{ ios: 'checkmark', android: 'check', web: 'check' }}
              size={14}
              tintColor={colors.primary}
            />
          ) : null}
        </MenuItem>
      ))}
      <MenuSeparator />
      <MenuItem textValue="Novo projeto" onPress={handleNewProject}>
        <MenuItemLabel>+ Novo projeto...</MenuItemLabel>
      </MenuItem>
    </>
  );

  if (isCollapsed) {
    return (
      <Menu
        placement="bottom left"
        offset={4}
        trigger={(triggerProps) => (
          <Pressable
            {...triggerProps}
            className="h-11 w-11 items-center justify-center rounded-xl active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel="Trocar projeto"
            accessibilityHint="Abre o menu de seleção de projetos"
          >
            <SymbolView
              name={{ ios: 'arrow.up.arrow.down', android: 'swap_vert', web: 'swap_vert' }}
              size={18}
              tintColor={colors.textSecondary}
            />
          </Pressable>
        )}
      >
        {menuItems}
      </Menu>
    );
  }

  return (
    <Menu
      placement="bottom left"
      offset={4}
      trigger={(triggerProps) => (
        <Pressable
          {...triggerProps}
          className="flex-row items-center justify-between rounded-xl px-2 py-2 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Trocar projeto"
          accessibilityHint="Abre o menu de seleção de projetos"
        >
          <Text
            className="text-xs font-medium uppercase tracking-widest text-foreground-secondary"
            numberOfLines={1}
          >
            {displayName}
          </Text>
          <SymbolView
            name={{ ios: 'arrow.up.arrow.down', android: 'swap_vert', web: 'swap_vert' }}
            size={14}
            tintColor={colors.textSecondary}
          />
        </Pressable>
      )}
    >
      {menuItems}
    </Menu>
  );
}
