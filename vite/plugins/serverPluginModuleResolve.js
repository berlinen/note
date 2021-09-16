const fs = require('fs').promises
const path = require('path')
const { resolveVue } = require('./utils')
const moduleReg = /^\/@modules\//


const moduleResolvePlugin = ({ app, root }) => {
  const vueResolved = resolveVue(root) // 根据当前运行的vite的目录解析出一个文件表来，包含着vue中所有的模块
  app.use(async(ctx, next) => {

    if(!moduleReg.test(ctx.path)) { // 处理当前的请求路径 是否以@modules开头的
      return next()
    }
    // @modules 替换掉
    const id = ctx.path.replace(moduleReg, '') // vue

    ctx.type = 'js' // 设置响应的类型 响应的结果是js

    // 应该去当前项目下查找vue对应的真实的文件
    const content = await fs.readFile(vueResolved[id], 'utf8')

    ctx.body = content
  })
}

exports.moduleResolvePlugin = moduleResolvePlugin