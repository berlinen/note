const { Readable} = require('stream')
const path = require('path')

const readBody = (stream) => {
  // koa中要求所有的异步方法必须包装成promise
  if(stream instanceof Readable) { //值2对文件流做处理
    return new Promise((resolve, reject) => {
      let res = ''
      stream.on('data', data => {
        res += data
      })

      stream.on('end', () => {
        resolve(res) // 将内容解析完成抛出去
      })
    })
  } else {
    return Promise.resolve(stream.toString())
  }
}

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

module.exports = readBody

module.exports = {
  readBody,
  resolveVue
}