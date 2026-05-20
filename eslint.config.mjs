import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import prettierConfig from '@vue/eslint-config-prettier';
import babelParser from '@babel/eslint-parser';
import globals from 'globals';

export default [
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: babelParser,
                requireConfigFile: false,
                sourceType: 'module',
            },
        },
    },
    ...pluginVue.configs['flat/vue2-essential'],
    prettierConfig,
    {
        files: ['**/*.js'],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
            },
        },
    },
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
        rules: {
            'no-console': 'off',
            'vue/multi-word-component-names': 'off',
            'vue/no-reserved-component-names': 'off',
            'vue/valid-v-slot': ['error', { allowModifiers: true }],
        },
    },
    {
        files: ['**/__tests__/*.{j,t}s?(x)'],
        languageOptions: {
            globals: globals.jest,
        },
    },
];
