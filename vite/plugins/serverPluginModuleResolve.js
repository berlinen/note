const fs = require('fs').promises
const path = require('path')
const moduleReg = /^\/@modules\//

function resolveVue(root) {
  //  vue3 you6几部分组成 runtime-dom runtine-core compiler reactivity shared compiler-sfc  在后端中解析.vue文件

  // 编译是在后端实现的，所以我需要拿到的文件是commonJs规范的
  const compilerPkgPath = path.join(root, 'node_modules', '@vue/compiler-sfc/package.json')

  const compilerPkg = require(compilerPkgPath) // 获取的是json中的文件

  // node_modules/@vue/compiler-src/dist/compiler-sfc.cjs.js
  const compilerPath = path.join(path.dirname(compilerPkgPath), compilerPkg.main)

  const resolvePath = name => path.resolve(root, 'node_modules', `@vue/${name}/dist/${name}.esm-bundler.js`)

  const runtimeDomPath = resolvePath('runtime-dom')
  const runtimeCorePath = resolvePath('runtime-core')
  const reactivityPath = resolvePath('reactivity')
  const sharedPath = resolvePath('shared')

  // esModule 模块
  return { // 用于稍后后端进行编译的文件路径
    compiler: compilerPath,
    '@vue/runtime-dom': runtimeDomPath,
    '@vue/runtime-core': runtimeCorePath,
    '@vue/reactivity': reactivityPath,
    '@vue/shared': sharedPath,
    vue: runtimeDomPath
  }
}


const moduleResolvePlugin = ({ app, root }) => {
  const vueResolved = resolveVue(root) // 根据当前运行的vite的目录解析出一个文件表来，包含着vue中所有的模块

  app.use(async(ctx, next) => {

    if(!moduleReg.test(ctx.path)) { // 处理当前的请求路径 是否以@modules开头的
      return next()
    }
    // @modules 替换掉
    const id = ctx.path.replace(moduleReg, '') // vue
    console.log('>>>>id>>', id)

    ctx.type = 'js' // 设置响应的类型 响应的结果是js

    // 应该去当前项目下查找vue对应的真实的文件
    const content = await fs.readFile(vueResolved[id], 'utf8')

    ctx.body = content
  })
}

exports.moduleResolvePlugin = moduleResolvePlugin