// @ts-nocheck

import tanstackQuery from '@tanstack/eslint-plugin-query';
import expoConfig from 'eslint-config-expo/flat.js';
import eslintConfigPrettier from 'eslint-config-prettier';
import promise from 'eslint-plugin-promise';
import reactNative from 'eslint-plugin-react-native';
import reactNativeA11y from 'eslint-plugin-react-native-a11y';
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['node_modules/', 'coverage/', 'dist/', '.expo/', '.yarn/', 'build/', '.cache/'],
  },
  ...expoConfig,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // --- TypeScript ---
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-native': reactNative,
      'unused-imports': unusedImports,
      '@tanstack/query': tanstackQuery,
      promise,
      'react-native-a11y': reactNativeA11y,
    },
    rules: {
      // --- General ---
      'no-extra-boolean-cast': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',

      // --- React ---
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react/jsx-boolean-value': ['warn', 'never'],
      'react/jsx-no-leaked-render': ['warn', { validStrategies: ['ternary', 'coerce'] }],
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-key': 'error',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'warn',

      // --- React Hooks ---
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // --- React Native ---
      'react-native/no-unused-styles': 'warn',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/split-platform-components': 'warn',

      // --- React Native A11y ---
      'react-native-a11y/has-accessibility-hint': 'warn',
      'react-native-a11y/has-valid-accessibility-actions': 'warn',
      'react-native-a11y/has-valid-accessibility-component-type': 'warn',
      'react-native-a11y/has-valid-accessibility-role': 'warn',
      'react-native-a11y/has-valid-accessibility-state': 'warn',
      'react-native-a11y/has-valid-accessibility-states': 'warn',
      'react-native-a11y/has-valid-accessibility-traits': 'warn',
      'react-native-a11y/has-valid-accessibility-value': 'warn',
      'react-native-a11y/has-valid-accessibility-descriptors': 'warn',
      'react-native-a11y/no-nested-touchables': 'warn',
      'react-native-a11y/has-valid-accessibility-ignores-invert-colors': 'warn',
      'react-native-a11y/has-valid-accessibility-live-region': 'warn',
      'react-native-a11y/has-valid-important-for-accessibility': 'warn',

      // --- TanStack Query ---
      '@tanstack/query/exhaustive-deps': 'warn',
      '@tanstack/query/no-rest-destructuring': 'warn',
      '@tanstack/query/stable-query-client': 'error',

      // --- Promise ---
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/catch-or-return': 'warn',
      'promise/always-return': 'warn',
      'promise/no-nesting': 'warn',

      // --- Import ordering ---
      'import/no-cycle': 'error',
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
          ignoreCase: true,
        },
      ],
      'import/order': [
        'error',
        {
          groups: [['external', 'builtin'], 'internal', ['sibling', 'parent'], 'index'],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'react-native', group: 'builtin', position: 'after' },
            { pattern: '@/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  reactYouMightNotNeedAnEffect.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
