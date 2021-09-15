const path = require('path')
const readBody = require('./utils')

const moduleRewritePlugin  = ({ app, root }) => {
  app.use(async(ctx, next) => {
    await next() // ctx.body = await fs.createReadStream

    // 在这里完善了自己的逻辑，洋葱模型

    // 获取流中的数据
    if(ctx.body && ctx.response.is('js')) {
      let content = await readBody(ctx.body)
      // 重写内容， 然后将重写的结果返回回去
      console.log(content)
    }
  })
}

exports.moduleRewritePlugin = moduleRewritePlugin