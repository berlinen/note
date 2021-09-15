const path = require('path')
const {parse} = require('es-module-lexer') //  解析import语法的
const MagicString =  require('magic-string') // 因为字符串具有不变性
const readBody = require('./utils')

function rewriteImports(source) {
  let imports = parse(source)[0]
  let magicString = new MagicString(source) // 把这个字符串转换为对象 // overwrite
  if(imports.length) {
    // 说明有多条import语法
    for(let i = 0; i < imports.length; i++) {
      let { s, e } = imports[i]
      let id = source.substring(s, e) // vue, ./App
      // 当前开头是 / 或者 . 不需要重写
      if(/^[^\/\.]/.test(id)) {
        id = `/@modules/${id}` // 标识这个模块是第三方模块
        magicString.overwrite(s, e, id)
      }
    }
  }

  return magicString.toString() // 将替换后的结果返回 增加/@module 浏览器会再次发送请求， 服务器要拦截，带有/@modules前缀的请求进行处理
}

const moduleRewritePlugin  = ({ app, root }) => {
  app.use(async(ctx, next) => {
    await next() // ctx.body = await fs.createReadStream

    // 在这里完善了自己的逻辑，洋葱模型

    // 获取流中的数据
    if(ctx.body && ctx.response.is('js')) {
      let content = await readBody(ctx.body)
      // 重写内容， 然后将重写的结果返回回去
      const result = rewriteImports(content)
      ctx.body = result
    }
  })
}

exports.moduleRewritePlugin = moduleRewritePlugin