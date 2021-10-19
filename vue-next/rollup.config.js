// rollup 配置

import path from 'path'

// 根据环境变量中的taeget属性， 获取对应模块中的package.json 的buildOption

// 找到packagss
const packagesDir = path.resolve(__dirname, 'packages')

// 找到要打包的某个包  打包的基准目录
const packageDir = path.resolve(packagesDir,  process.env.TARGET)

// 永远针对某个模块
const resolve  = (p) => path.resolve(packageDir, p)

const pkg = require(resolve('package.json'))

const pkgName = path.basename(packageDir)

// 对打包类型做一个映射表， 根据你提供的 formats来格式化需要打包的内容
const outputConfig = {
  'esm-builder': {
    file: resolve(`dist/${pkgName}.esm-bundler.js`),
    format: 'es'
  },
  'cjs': {
    file: resolve(`dist/${pkgName}.cjs.js`),
    format: 'cjs'
  },
  'global': {
    file: resolve(`dist/${pkgName}.global.js`),
    format: 'iife' // 立即执行函数
  }
}

const options = pkg.buildOptions

const createConfig = (format, output) => {
  
}

// rollup 最终需要导出配置
options.formats.map(format => createConfig(format, outputConfig))
