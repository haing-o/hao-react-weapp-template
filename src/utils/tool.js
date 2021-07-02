/**
 * 工具类
 */

import {forOwn} from "lodash";
/**
 * 睡眠函数
 * @param time {number}
 * @returns {Promise<unknown>}
 */
export const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 方便使用await版本的setState
 * @param that 当前this
 * @param obj {object} setState的对象
 * @return {Promise<unknown>}
 */
export const setStateSync = (that, obj) => {
  return new Promise(resolve => {
    that.setState(obj, () => {
      resolve();
    })
  })
}

/**
 * 判断是函数就调用
 * @param msg
 * @param value
 * @return {*}
 */
export const msgCallBack = (msg, value) => {
  if (typeof msg === 'function') {
    return msg(value);
  } else {
    return msg;
  }
}

/**
 * 对象统一赋值
 * @param obj
 * @param that
 * @param keyName {string} setState中的名称
 * @param init
 */
export const setObjEveryValue = async (obj, that, keyName, init = "") => {
  obj = forOwn(obj, (value, key) => {
    obj[key] = msgCallBack(init, value);
  })
  await setStateSync(that, {
    [keyName]: obj
  })
}

/**
 * 按照数组里的key提取对应的字段值
 * @param array
 * @param from {object}
 * @param to {object}
 * @return {{}}
 */
export const getObjFromKeyArray = (array, from, to = {}) => {
  array.forEach(key => {
    to[key] = from[key];
  })
  return to;
}

/**
 * 是否是函数
 * @param val
 * @return {boolean}
 */
export function isFunction(val) {
  return typeof val === 'function';
}

/**
 * 是否是对象
 * @param val
 * @return {boolean}
 */
export function isPlainObject(val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

/**
 * 是否是promise
 * @param val
 * @return {boolean}
 */
export function isPromise(val) {
  return isPlainObject(val) && isFunction(val.then) && isFunction(val.catch);
}
