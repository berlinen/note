//  把packgaes下的所有包都进行打包

const fs = require('fs')
const execa = require('execa') // 开启子进程 进行打包

const targets = fs.readdirSync('packages')
                  .filter(file => fs.statSync(`packages/${file}`).isDirectory())

// 对目标进行依次打包，并行打包
const build = async(target) => { // rollup -c --environment target
  await execa('rollup', ['-c', '--environment', `TARGET:${target}`], {
    stdio: 'inherit' // 当子进程打包的信息共享给父进程
  })
}

const runParallel = (targets, iteratorFn) => {
  const res = []
  for(const item of targets) {
    const p = iteratorFn(item)
    res.push(p)
  }

  return Promise.all(res)
}

runParallel(targets, build)
