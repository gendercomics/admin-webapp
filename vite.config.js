import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { BootstrapVueNextResolver } from 'bootstrap-vue-next';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ command }) => ({
    plugins: [
        vue(),
        Components({
            resolvers: [BootstrapVueNextResolver()],
        }),
    ],
    base: command === 'build' ? '/admin/' : '/',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    },
    server: {
        port: 8080,
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/unit/setup.js'],
    },
}));
