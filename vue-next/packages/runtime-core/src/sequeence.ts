const arr = [2, 3, 1, 5, 6, 8, 7,9, 4]

// 2
// 2  3
// 1 3
// 1 3 5
// 1 4 5 6
// 1 4 5 6 8
// 1 4 5 6 7
// 1 4 5 6 7 9
// 1 3 4 6 7 9

function getSequence(arr) {
  let result = [0]
  let len = arr.length
  const p = arr.slice(0) // 拷贝一份 和原本的数组相同 用来存放索引
  let start
  let end
  let middle

  for(let i = 0; i < len; i++) { //   结果是索引
    let arrI = arr[i]
    if(arrI !== 0) {
      let lastResultIndex = result[result.length - 1]
      if(arrI > arr[lastResultIndex]) {
        p[i] = lastResultIndex // 标记前一个对应的索引
        // 取索引
        result.push(i) // 当前的值比上一个大 直接push 并且让这个记录他的前一个

        continue
      }
      // 二分查找 找到比当前值大的那一个
      start = 0
      end = result.length - 1
      while(start < end) { // 重合就说明找到了对应的值
        middle =( (start + end) / 2) | 0 // 找到中间位置
        if(arr[result[middle]] < arrI) {
          start = middle + 1
        } else {
          end = middle
        } // 找到结果集合中 比当前这一项大的数
      }

      if(arr[result[start]] > arrI) { // 如果相同 或者比当前的的还大就不换了
        if(start > 0) { // 才需要替换
          p[i] = result[start - 1] // 需要将他替换的前一个记住
        }
        result[start] = i
      }
    }

  }

  let resLen = result.length // 总的个数
  let last = result[resLen - 1] // 取最后一个
  // 根据前驱节点一个一个向前查找
  while(resLen-- > 0) {
    result[resLen] = last
    last = p[last] // 最后一项等于当前最后一项
  }

  return result
}

export { getSequence }

