import React, { useEffect, useState } from 'react';

import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';

import { BackHandler, Modal, Text, View } from 'react-native';

import { checkDeviceIntegrity } from '@/hooks/device-security';

export function DeviceCompromisedModal() {
  const { t } = useTranslation();
  const [isCompromised, setIsCompromised] = useState(false);

  useEffect(() => {
    checkDeviceIntegrity()
      .then(({ isCompromised: compromised }) => setIsCompromised(compromised))
      .catch(() => {});
  }, []);

  return (
    <Modal
      visible={isCompromised}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => BackHandler.exitApp()}
    >
      <View className="flex-1 items-center justify-center bg-black/70">
        <View className="mx-6 overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-800">
          {/* Icon */}
          <View className="items-center pb-4 pt-8">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <SymbolView
                name={{
                  ios: 'exclamationmark.shield.fill',
                  android: 'security',
                  web: 'security',
                }}
                size={40}
                tintColor="#dc2626"
              />
            </View>
          </View>

          {/* Content */}
          <View className="px-6 pb-8">
            <Text className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
              {t('security.compromisedTitle')}
            </Text>

            <Text className="text-center text-base leading-6 text-gray-600 dark:text-gray-400">
              {t('security.compromisedDescription')}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
