const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  configureWebpack: {
    name: '测试',
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
