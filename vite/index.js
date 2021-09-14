const Koa = require('koa')
const { serveStaticPlugin } = require('./plugins/serverPluginsServeStatic')
function createServer() {
  const app = new Koa() // 创建一个koa实例
  const root = process.cwd() // 拿到程序正在运行的路径

  // 当用户运营 npm run vite-dev 会创建服务

  // 创建一个上下文
  const context  = {
    app,
    root // 当前根的位置
  }

  // koa是基于koa中间件来运行的
  // 可以用每一个文件来表示
  const resolvedPlugins = [ // 插件的集合
    // 1） 实现一个静态服务
    serveStaticPlugin
  ]

  resolvedPlugins.forEach(plugin => plugin(context))


  return app
}

module.exports = createServer