// 快速排序

// 循环不变式

// 小于支点   大于支点   未确认

function swap(A, i, j) {
  [A[i], A[j]] = [A[j], A[i]]
}


function devide(A, p, r) {
  const x = A[r-1] // 当前的支点
  let i = p - 1 //  i 指向最后一个小于支点的数字  // j 指向下一个未确认的数字
  for(let j = p; j < r - 1; j++) {
    if(A[j] < x) {
      i++
      swap(A, i, j)
    }
  }
  swap(A, i + 1, r  - 1)
  return i + 1
}

function qSort(A, p = 0, r) {
  r = typeof r !== 'undefined' ? r : A.length
  if(p < r -1) { // 递归到只有一项就终止了
    const q = devide(A, p, r)
    qSort(A, p, q)
    qSort(A, q + 1, r)
  }
  return A
}

module.exports = qSort