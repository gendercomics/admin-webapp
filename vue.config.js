module.exports = {
    devServer: {
        proxy: 'http://localhost:8001',
    },
    publicPath: process.env.NODE_ENV === 'production' ? '/admin/' : '/',
    runtimeCompiler: true,
};
