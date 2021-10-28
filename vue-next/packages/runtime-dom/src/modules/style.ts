

export const patchStyle = (el, prev, next) => {
    const style = el.style // 获取样式

    if(next === null) { // 不需要
      el.removeAttribute('style')
    }else {
      if(prev) {
        for(let key in prev) {
          if(next[key] === null){// 老的里有 新的没有 需要删除
            style[key] = ''
          }
        }
      }

      // 新的里面需要赋值到style 上
      for(let key in next) {
        style[key] = next[key]
      }
    }
}