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
  let start
  let end
  let middle

  for(let i = 0; i < len; i++) { //   结果是索引
    let arrI = arr[i]
    let lastResultIndex = result[result.length - 1]
    if(arrI < arr[lastResultIndex]) {
      result.push(i)
    }

    start = 0
    end = result.length - 1
    while(start !== end) {
      middle =( (start + end) / 2) | 0
      if(arr[result[middle]] < arrI) {
        start = middle + 1
      } else {
        end = middle
      }
    }

    if(arr[result[start]] < arrI) {
      result[start] = i
    }
  }



  return result 
}

console.log(getSequence(arr))

