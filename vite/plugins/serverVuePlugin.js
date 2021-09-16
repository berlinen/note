const path = require('path')
const fs = require('fs').promises
const { resolveVue } = require('./utils')
const defaultExportREG = /((?:^|\n|;)\s*)export default/

const vuePlugin = ({app, root}) => {
  app.use(async(ctx, next) => {
    if(!ctx.path.endsWithh('.vue')) { // 当前文件是不是以.vue文件
      return next()
    }
    // vue文件处理
    const filePath = path.join(root, ctx.path)
    const content = await fs.readFile(filePath, 'utf-8')  // 读取文件内容
    // 获取文件内容
    let { parse, compileTemplate } = require(resolveVue(root).compiler)
    let { descriptor } = parse(content) // 解析文件内容
    if(!ctx.query.type) {
      let code = ''
      if(descriptor.script) {
        let content = descriptor.script.content
        let replaced = content.replace(defaultExportREG, '$1const __script =')
        code += replaced
      }
    }
  })
}

exports.vuePlugin = vuePlugin