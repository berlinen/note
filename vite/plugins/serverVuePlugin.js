const path = require('path')
const fs = require('fs').promises
const { resolveVue } = require('./utils')
const defaultExportREG = /((?:^|\n|;)\s*)export default/

const vuePlugin = ({app, root}) => { // ast语法树
  app.use(async(ctx, next) => {
    if(!ctx.path.endsWith('.vue')) { // 当前文件是不是以.vue文件
      return next()
    }
    // vue文件处理
    const filePath = path.join(root, ctx.path)
    const content = await fs.readFile(filePath, 'utf-8')  // 读取文件内容
    // 获取文件内容
    // 拿到模版编译的模块进行编译
    let { parse, compileTemplate } = require(resolveVue(root).compiler)
    let { descriptor } = parse(content) // 解析文件内容
    if(!ctx.query.type) { // App.vue
      let code = ''
      if(descriptor.script) {
        let content = descriptor.script.content
        let replaced = content.replace(defaultExportREG, '$1const __script =')
        code += replaced
      }
      if(descriptor.template) { // App.vue?type=template
        const templateRequest = ctx.path + `?type=template`
        code += `\nimport { render as __render } from ${JSON.stringify(templateRequest)}`
        code += `\n__script.render = __render`
      }
      ctx.type = 'js'
      code +=  `\nexport default __script`
      ctx.body = code
    }
    if(ctx.query.type === 'template') {
      ctx.type = 'js'
      let content = descriptor.template.content
      const { code } = compileTemplate({ source: content })
      ctx.body = code
    }
  })
}

exports.vuePlugin = vuePlugin