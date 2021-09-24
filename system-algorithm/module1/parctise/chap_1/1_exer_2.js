// 插入排序

// 循环不变式：每次循环结束，存在一个已经排序的列表和一个未排序的列表，j指向下一个未排序的数字
/**
 * @title 插入排序
 * @time best O(n) warest: O(n^2)
 * @param {*} arr
 */
function insert_sort(arr) {
  for(let j = 1; j  < arr.length; j++) {
    const key = arr[j] // 取出未排序数组第一项
    let i = j - 1 // 已排序最后一项索引
    while( i >= 0 && arr[i] > key) {
      arr[i + 1]  = arr[i] // 交换
      i--
    }
    arr[i + 1]  = key
  }
  return arr
 }

/**
 * 归并排序 拆倒只有两个元素为止
 * 拆分 -> 比较 -> 合并·
 * @param {*} arr
 */

const SENTINEL = Number.MAX_SAFE_INTEGER
 function divide_conquer_sort(arr)  {

 }
 /**
  * 时间复杂度 O(N)
  * @param {*} p
  * @param {*} r
  * @returns
  */
 function devide(p, r) {
    return Math.floor((p + r) / 2)
 }

 /**
  *
  * A --- [3, 4]    [1, 2]
  *
  * A1 ---[3, 4, 9999999999]    [1, 2,  9999999999]
  *
  * i               j
  * 1  2
  *    j = 2
  *
  * @param {*} A 原数组
  * @param {*} p  起始值
  * @param {*} q  分割值
  * @param {*} r 结束值
  * 时间复杂度 O(NlgN)
  */
 function conquer(A, p, q, r) {
    const A1  = A.slice(p, q)
    const A2 = A.slice(q, r)

    A1.push(SENTINEL) // 哨兵
    A2.push(SENTINEL)
    // k 循环不变式中间值
    for(let k = p, i = 0, j = 0; k < r;  k++) {
      A[k] =  A1[i] < A2[j] ? A1[i++] : A2[j++]
    }
    // console.log('A>>>>', A)
 }

 function merge_sort(A, p = 0, r) {
   r = r || A.length
   if(r - p === 1) return
   if(r - p === 2) {
     if(A[p] > A[r-1]) {
       [A[p], A[r-1]] = [A[r-1], A[p]]
     }
     return
   }
   const q = devide(p, r)
   // console.log('divide:', q)

     (A, p, q)
   merge_sort(A, q, r)
   conquer(A, p, q, r)
   return A
 }

 // 测试方法

 module.exports = {
  insert_sort,
  merge_sort
 }

 merge_sort([1, 3, 5, 2, 4, 6])



