/**
 * 管理全局变量
 */

const globalData = {};

export const setGlobalData = (key, val) => {
  globalData[key] = val;
}
export const getGlobalData = (key) => {
  return globalData[key];
}
