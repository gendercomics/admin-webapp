import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import prettierConfig from '@vue/eslint-config-prettier';
import globals from 'globals';

export default [
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                sourceType: 'module',
            },
        },
    },
    ...pluginVue.configs['flat/essential'],
    prettierConfig,
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
        files: ['**/__tests__/*.{j,t}s?(x)', '**/*.spec.{j,t}s?(x)'],
        languageOptions: {
            globals: globals.node,
        },
    },
];
