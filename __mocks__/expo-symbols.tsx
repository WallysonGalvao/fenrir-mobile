import React from 'react';
import { View } from 'react-native';

export const SymbolView = (props: Record<string, unknown>) => (
  <View testID="symbol-view" {...props} />
);
