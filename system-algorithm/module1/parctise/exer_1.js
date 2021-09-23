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

   return arr
 }

 function gen(w) {
   let arr = []
   for(let i = 0 ; i < 10000 * w; i++) {
     arr.push(i)
   }
   return arr
 }

 console.log(finish_yates_shuffle(gen(100)))