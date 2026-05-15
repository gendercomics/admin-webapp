module.exports = {
    devServer: {
        proxy: 'http://localhost:8001',
    },
    publicPath: process.env.NODE_ENV === 'production' ? '/admin/' : '/',
    runtimeCompiler: true,
    // ESLint v8 removed CLIEngine which @vue/cli-plugin-eslint@4 depends on.
    // Linting is handled separately via `pnpm run lint` / CI.
    lintOnSave: false,
};
