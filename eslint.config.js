// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      // Désactiver la validation des chemins d'import car les alias @ sont gérés par TypeScript
      'import/no-unresolved': 'off',
    },
  },
]);
