let arr = [-1, 0, 1, 2, -1, -4]

function threeSum(nums) {
  let result = new Set()
  if(nums.length >= 3) {
    nums.sort((a, b) => a - b)
    let i = 0
    while(i < nums.length - 2) {
      twoSum(nums, i, result)
      let temp = nums[i]
      while(i < nums.length && temp === nums[i]){
        i++
      }
    }
  }

  function twoSum(nums, i, result) {
    let j = i + 1
    let k = nums.length - 1
    while(j < k) {
      if(nums[i] + nums[j] + nums[k] === 0) {
        result.add([nums[i], nums[j], nums[k]])
        let temp = nums[j]
        while(j < k && nums[j] === temp) {
          j++
        }
      } else if(nums[i] + nums[j] + nums[k] < 0) {
        j++
      } else {
        k--
      }
    }
  }


  return result
}

console.log(threeSum(arr))
