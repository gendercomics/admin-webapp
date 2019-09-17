module.exports = {

  devServer: {
    proxy: {
      'http://api.localhost/': {
        target: 'http://localhost:8001',
        ws: true,
        changeOrigin: true
      }
    }
  },
  publicPath: "/"
};
