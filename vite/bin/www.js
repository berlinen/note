#! /usr/bin/env node

const createServer = require('../index')

// 创建一个koa服务
createServer().listen(4000, () => {
  console.log('server on port 4000', 'http://localhost:4000')
})