const fs = require('fs')

const numberStr = fs.readFileSync('./100w.data', 'utf8')
const numbers = numberStr.split('\n')

const startTime = new Date().getTime()
numbers.sort((a, b) => a -  b)

const endTime =  new Date().getTime()

const finshTime = endTime - startTime


console.log('finished:' + finshTime + 'ms')
