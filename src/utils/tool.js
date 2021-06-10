/**
 * 工具类
 */

/**
 * 睡眠函数
 * @param time
 * @returns {Promise<unknown>}
 */
export const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
}
