// 只针对具体的某个包

const fs = require('fs')
const execa = require('execa') // 开启子进程 进行打包

const target = 'runtime-dom'

// 对目标进行依次打包，并行打包
const build = async(target) => { // rollup -c --environment target
  await execa('rollup', ['-wc', '--environment', `TARGET:${target}`], {
    stdio: 'inherit' // 当子进程打包的信息共享给父进程
  })
}

build(target)