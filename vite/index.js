const Koa = require('koa')

function createServer() {
  const app = new Koa() // 创建一个koa实例

  // 当用户运营 npm run vite-dev 会创建服务


  return app
}

module.exports = createServer