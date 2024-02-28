module.exports = {
  lintOnSave: false,

  transpileDependencies: [
    'vuetify', 'vuex-module-decorators'
  ],

  devServer: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'ddns.9up.in',
      'y2nk4buf.ddns.net',
      'ddns.9up.in:8080',
      'y2nk4buf.ddns.net:8080',
    ],
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7001/',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
