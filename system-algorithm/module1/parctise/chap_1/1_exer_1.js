 // 打乱

 function finish_yates_shuffle(arr) {
   for(let i = 0; i < arr.length; i++) { // 2n + 2
     // 从·【i，arr.length - 1】 中取一个整数
     // 从 【i, n)
     const j = i + Math.floor(Math.random() * (arr.length - i));
     // c * n
     // 交换
     [arr[i], arr[j]] = [arr[j], arr[i]]
   }
   // 2n + 2 + （c1 + c2）*n = (c1+c2+2) * n + c3
   return arr
 }

 function gen(w) {
   let arr = []
   for(let i = 0 ; i < 10000 * w; i++) {
     arr.push(i)
   }
   // 打乱
   finish_yates_shuffle(arr)
   return arr
 }

 // test
 let count = 0
 for(let j = 0; j < 10000; j++) {
   const q = finish_yates_shuffle([1,2,3,4])
   if(q[1] === 2) {
     count++
   }
 }

 // console.log(count/10000)

//  console.log(finish_yates_shuffle(gen(100)))

const arr = gen(10)
for(let i = 0 ; i < arr.length; i++)  {
  console.log(arr[i])
}