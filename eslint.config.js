import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactCompiler from 'eslint-plugin-react-compiler';
import tanstack from '@tanstack/eslint-plugin-query';
import next from '@next/eslint-plugin-next';

const nextFlat = next.configs?.['flat/recommended'];
const tanstackFlat = tanstack.configs?.['flat/recommended'];

const coreWebVitalsRules = next.configs?.['core-web-vitals']?.rules ?? {};

export default tseslint.config(
  ...(Array.isArray(tanstackFlat) ? tanstackFlat : []),
  ...(nextFlat ? [nextFlat] : []),

  { ignores: ['.next', 'dist'] },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      '@next/next': next,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-compiler': reactCompiler,
    },
    rules: {
      ...coreWebVitalsRules,

      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-compiler/react-compiler': 'error',
    },
    extends: [js.configs.recommended, ...tseslint.configs.strict, prettierRecommended],
    settings: { react: { version: 'detect' } },
  }
);
