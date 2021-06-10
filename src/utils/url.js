/**
 * 对象转为url参数
 * @param obj
 * @return {string}
 */
export const objToUrlParam = (obj) => {
  let params = [];
  for (let key in obj) {
    if (obj[key]) {
      params.push(key + "=" + obj[key]);
    }
  }
  return params.join('&');
}
