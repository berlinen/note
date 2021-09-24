const fs = require('fs')
const {insert_sort, merge_sort} = require('./1_exer_2')

const numberStr = fs.readFileSync('./10w.data', 'utf8')
const numbers = numberStr.split('\n')

const startTime = new Date().getTime()
// numbers.sort((a, b) => a -  b)
console.log(merge_sort(numbers))

const endTime =  new Date().getTime()

const finshTime = endTime - startTime


console.log('finished:' + finshTime + 'ms')
