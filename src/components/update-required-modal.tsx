/**
 * Update Required Modal
 * Shown when a force update is required
 * Blocks the app until user updates
 */

import React from 'react';

import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';

import { Modal, Pressable, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

interface UpdateRequiredModalProps {
  visible: boolean;
  currentVersion: string;
  latestVersion: string | null;
  onUpdate: () => void;
  /**
   * If true, user cannot dismiss the modal (force update)
   */
  isRequired?: boolean;
  onDismiss?: () => void;
}

export function UpdateRequiredModal({
  visible,
  currentVersion,
  latestVersion,
  onUpdate,
  isRequired = true,
  onDismiss,
}: UpdateRequiredModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={isRequired ? undefined : onDismiss}
    >
      <View className="flex-1 items-center justify-center bg-black/70">
        <View className="mx-6 overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-800">
          {/* Icon */}
          <View className="items-center pb-4 pt-8">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
              <SymbolView
                name={{
                  ios: 'iphone.and.arrow.forward',
                  android: 'system_update',
                  web: 'system_update',
                }}
                size={40}
                tintColor={theme.primary}
              />
            </View>
          </View>

          {/* Content */}
          <View className="px-6 pb-6">
            <Text className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
              {isRequired ? t('update.requiredTitle') : t('update.availableTitle')}
            </Text>

            <Text className="mb-6 text-center text-base leading-6 text-gray-600 dark:text-gray-400">
              {isRequired ? t('update.requiredDescription') : t('update.availableDescription')}
            </Text>

            {/* Version info */}
            <View className="mb-6 rounded-2xl bg-gray-100 p-4 dark:bg-gray-900/50">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('update.currentVersion')}
                </Text>
                <Text className="text-sm font-bold text-gray-900 dark:text-white">
                  {currentVersion}
                </Text>
              </View>
              {latestVersion ? (
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('update.latestVersion')}
                  </Text>
                  <Text className="text-sm font-bold text-primary-600">{latestVersion}</Text>
                </View>
              ) : null}
            </View>

            {/* Update button */}
            <Pressable
              onPress={onUpdate}
              style={{ backgroundColor: theme.primary }}
              className="mb-3 h-14 flex-row items-center justify-center gap-2 rounded-2xl active:scale-[0.98]"
              accessibilityRole="button"
            >
              <SymbolView
                name={{ ios: 'square.and.arrow.down', android: 'download', web: 'download' }}
                size={24}
                tintColor="white"
              />
              <Text className="text-lg font-bold text-white">{t('update.updateNow')}</Text>
            </Pressable>

            {/* Dismiss button (only for optional updates) */}
            {!isRequired && onDismiss ? (
              <Pressable
                onPress={onDismiss}
                className="h-12 items-center justify-center rounded-2xl active:opacity-70"
                accessibilityRole="button"
              >
                <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
                  {t('update.later')}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}
