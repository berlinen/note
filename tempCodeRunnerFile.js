let arr = [-1, 0, 1, 2, -1, -4]

function threeSum(nums) {
  nums.sort((a, b) => a - b)
  console.log(nums)
  let result = new Set()
  if(nums.length >= 3) {
    let i = 0
    while(i < nums.length - 2) {
      twoSum(nums, i, result)
    }
  }

  function twoSum(nums, i, result) {
    let j = i + 1
    let k = nums.length - 1
    while(j < k) {
      if(nums[i] + nums[j] + nums[k] === 0) {

      } else if(nums[i] + nums[j] + nums[k] < 0) {
        j++
      } else {
        k--
      }
    }
  }
}

threeSum(arr)