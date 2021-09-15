const { Readable} = require('stream')

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

module.exports = readBody