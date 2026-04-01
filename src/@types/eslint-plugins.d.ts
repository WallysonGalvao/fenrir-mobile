declare module 'eslint-config-expo/flat.js' {
  import type { Linter } from 'eslint';
  const config: Linter.Config[];
  export default config;
}

declare module 'eslint-plugin-react-native' {
  import type { ESLint } from 'eslint';
  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module 'eslint-plugin-react-native-a11y' {
  import type { ESLint } from 'eslint';
  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module 'eslint-plugin-unused-imports' {
  import type { ESLint } from 'eslint';
  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module 'eslint-plugin-promise' {
  import type { ESLint } from 'eslint';
  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module 'eslint-plugin-react-you-might-not-need-an-effect' {
  import type { ESLint, Linter } from 'eslint';
  const plugin: ESLint.Plugin & {
    configs: { recommended: Linter.Config };
  };
  export default plugin;
}
