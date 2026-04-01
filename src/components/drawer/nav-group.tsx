import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';

import { Pressable, Text, View } from 'react-native';

import { Tooltip, TooltipContent, TooltipText } from '@/components/tooltip';
import { useTheme } from '@/hooks/use-theme';

import { type DrawerEntry, type DrawerLeafItem, isInternalItemActive } from './types';

const linearTransition = LinearTransition.springify().damping(20).stiffness(220);

type DrawerNavGroupProps = {
  group: DrawerEntry;
  isCollapsed: boolean;
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (item: DrawerLeafItem) => void;
};

export function DrawerNavGroup({
  group,
  isCollapsed,
  pathname,
  isOpen,
  onToggle,
  onNavigate,
}: DrawerNavGroupProps) {
  const { t } = useTranslation();
  const colors = useTheme();
  const hasActiveChild = Boolean(
    group.items?.some((item) => isInternalItemActive(pathname, item.href)),
  );

  const button = (triggerProps = {}) => (
    <Pressable
      {...triggerProps}
      onPress={onToggle}
      className={`rounded-2xl border px-3 py-3 active:opacity-80 ${
        isCollapsed ? 'items-center justify-center px-0 py-0' : 'flex-row items-center gap-3'
      } ${
        hasActiveChild || isOpen
          ? 'border-primary/35 bg-background-element'
          : 'border-transparent bg-transparent web:hover:bg-foreground/5'
      } ${isCollapsed ? 'h-14 w-14 self-center' : ''}`}
      accessibilityRole="button"
      accessibilityLabel={group.label}
      accessibilityHint={t('drawer.actions.toggleGroup')}
      accessibilityState={{ expanded: isOpen }}
    >
      <View
        className={`items-center justify-center rounded-xl ${
          isCollapsed ? 'h-10 w-10' : 'h-10 w-10 bg-background-element'
        }`}
      >
        <SymbolView name={group.icon} size={20} tintColor={colors.text} />
      </View>

      {!isCollapsed ? (
        <>
          <Text className="flex-1 text-sm font-semibold text-foreground">{group.label}</Text>
          <SymbolView
            name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
            size={18}
            tintColor={colors.text}
            style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
          />
        </>
      ) : null}
    </Pressable>
  );

  if (isCollapsed) {
    return (
      <Tooltip trigger={(triggerProps) => button(triggerProps)} placement="right">
        <TooltipContent>
          <TooltipText>{group.label}</TooltipText>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <>
      {button()}

      {isOpen && group.items?.length ? (
        <Animated.View
          layout={linearTransition}
          entering={FadeInDown.duration(180)}
          exiting={FadeOutUp.duration(140)}
          className="ml-6 gap-1 border-l border-border pl-4"
        >
          {group.items.map((item) => {
            const isChildActive = isInternalItemActive(pathname, item.href);

            return (
              <Pressable
                key={item.key}
                onPress={() => onNavigate(item)}
                className={`rounded-xl px-3 py-3 active:opacity-80 ${
                  isChildActive
                    ? 'bg-background-element'
                    : 'bg-transparent web:hover:bg-foreground/5'
                }`}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                accessibilityHint={t('drawer.hints.navigate')}
                accessibilityState={{ selected: isChildActive }}
              >
                <Text
                  className={`text-sm ${
                    isChildActive ? 'font-semibold text-foreground' : 'text-foreground-secondary'
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>
      ) : null}
    </>
  );
}
