import { useCallback, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';

import { Pressable, Text, TextInput, View } from 'react-native';

import { SafeAreaView } from '@/components/safe-area-view';
import { createProject } from '@/lib/supabase/projects';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NewProjectModal() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const slug = slugify(name);

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => createProject(name.trim(), slug),
    onSuccess: async (project) => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      router.replace(`/${project.slug}/dashboard`);
    },
  });

  const handleCreate = useCallback(() => {
    if (!name.trim() || !slug) return;
    mutate();
  }, [mutate, name, slug]);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ presentation: 'modal', headerShown: false }} />

      <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
        <Text className="text-lg font-semibold text-foreground">Novo projeto</Text>
        <Pressable
          onPress={handleClose}
          className="rounded-xl px-3 py-2 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          accessibilityHint="Cancela a criação do projeto"
        >
          <Text className="text-base text-foreground-secondary">Cancelar</Text>
        </Pressable>
      </View>

      <View className="gap-6 px-4 py-6">
        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Nome</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Meu projeto"
            autoFocus
            accessibilityRole="text"
            accessibilityLabel="Nome do projeto"
            accessibilityHint="Digite o nome do novo projeto"
            className="rounded-xl border border-border bg-background-element px-4 py-3 text-base text-foreground"
            placeholderTextColor="#888"
          />
        </View>

        {slug ? (
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Slug</Text>
            <View className="rounded-xl border border-border bg-background-element px-4 py-3">
              <Text className="text-base text-foreground-secondary">{slug}</Text>
            </View>
          </View>
        ) : null}

        {error ? <Text className="text-sm text-red-500">{(error as Error).message}</Text> : null}

        <Pressable
          onPress={handleCreate}
          disabled={!name.trim() || isPending}
          className="items-center rounded-xl bg-primary px-4 py-3 active:opacity-80 disabled:opacity-50"
          accessibilityRole="button"
        >
          <Text className="text-base font-semibold text-primary-foreground">
            {isPending ? 'Criando...' : 'Criar projeto'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
