
let queue = []

export function queueJob(job) {
  if(!queue.includes(job)) {
    queue.push(job)
    // 队列刷新
    queueFlush()
  }
}

let isFlushPending = false // 是否在刷新中
function queueFlush() {
  if(!isFlushPending) {
    isFlushPending = true
    Promise.resolve().then(flushJobs)
  }
}

function flushJobs() {
  isFlushPending = false

  // 清空的时候 我们需要根据的调用的顺序依次调用 保证先刷新父再刷新子
  queue.sort((a, b) => a.id - b.id)
  for(let i = 0; i < queue.length; i++) {
    const job = queue[i]
    job()
  }

  queue.length = 0
}

