export const enum ShapeFlags {
  ELEMENT = 1, // 1
  FUNCTIONAL_COMPONENT = 1 << 1, // 2
  STATEFUL_COMPONENT = 1 << 2, // 4
  TEXT_CHILDREN = 1 << 3, // 8
  ARRAY_CHILDREN = 1 << 4, // 16
  SLOTS_CHILDREN = 1 << 5, // 32
  TELEPORT = 1 << 6, // 64
  SUSPENSE = 1 << 7, // 128
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 256
  COMPONENT_KEPT_ALIVE = 1 << 9, // 512
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT // 6
}

// 2进制 一个字节8位组成 8位组大都是1

// ｜ 有一个1就是1

// & 全是1 才是 1

// 6 & 2   2

// 6 & 4   4


// 6 & 8  0
