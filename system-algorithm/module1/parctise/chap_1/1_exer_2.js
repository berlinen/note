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


 function mid_sort(arr)  {
   
 }

 // 测试方法

 module.exports = insert_sort

 // insert_sort([1, 3, 5, 2, 4, 6])



