/**
 * 执行队列类
 */

class ChainQueue {
  constructor(items) {
    this.items = items || []
    this.maxNum = 200
  }

  // 添加队列
  entryQueue(node) {
    if (this.items.length > this.maxNum) {
      return
    }
    if (Array.isArray(node)) {
      node.map(item => this.items.push(item))
    } else {
      this.items.push(node)
    }
  }

  // 删除队列，返回删除的当前的项目
  deleteQueue(func = () => {}) {
    if (typeof func !== 'function') throw new Error(`[dashboard] ${func} is not function`)
    func(this.items.shift())
  }

  // 执行队列中全部项目
  executeQueue(func = () => {}) {
    if (typeof func !== 'function') throw new Error(`[dashboard] ${func} is not function`)
    new Array(this.items.length).fill(true).forEach(() => {
      this.deleteQueue(func)
    })
  }

  // 清除队列
  clear() {
    this.items = []
  }
  get size() {
    return this.items.length
  }

  get isEmpty() {
    return !this.items.length
  }

  result() {
    return this.items
  }
}

export default ChainQueue
