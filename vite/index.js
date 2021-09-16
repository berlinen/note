const Koa = require('koa')
const { serveStaticPlugin } = require('./plugins/serverPluginsServeStatic')
const { moduleRewritePlugin } = require('./plugins/serverPluginModuleRewrite.js')
const { moduleResolvePlugin } = require('./plugins/serverPluginModuleResolve.js')
const { htmlRewritePlugin } = require('./plugins/serverPluginHtml.js')
const { vuePlugin } = require('./plugins/serverVuePlugin')
/**
 *
 * @returns
 * 1 默认采用的是es6原生的模块 import 语法 在 es6中默认会发送一个请求
 * 2 默认会给vue模块增加一个前缀 /@module
 * 3 把.vue文件在后端解析称一个对象了 唯一就是编译了。vue文件
 * 4 node kia 快速搭建http服务
 */
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
    vuePlugin,
    htmlRewritePlugin,
    // 3） 解析import语法，进行一个重写的操作，重写路径
    moduleRewritePlugin,
    // 2) 解析 以/@modules文件开头的内容， 找到对应的结果
    moduleResolvePlugin,
    // 1） 实现一个静态服务
    serveStaticPlugin // 读取文件 将文件的结果放在ctx.body上
  ]

  resolvedPlugins.forEach(plugin => plugin(context))


  return app
}

module.exports = createServer