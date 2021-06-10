import Taro from "@tarojs/taro";


export const CookieName = 'HAO-COOKIE';

/**
 * 保存cookie
 * @param cookie
 * @return {Promise}
 */
export const setCookieStorage = (cookie) => {
  console.log('setCookie=>', cookie);
  return Taro.setStorage({
    key: 'Cookie',
    data: cookie
  })
}

/**
 * 获取cookie
 * @param cookie
 * @return {Promise}
 */
export const getCookieStorage = () => {
  return new Promise(resolve => {
    Taro.getStorage({
      key: 'Cookie'
    }).then(res => {
      if(res && res.data) {
        console.log('getCookie=>', res.data);
        resolve(res.data);
      }
    })
      .catch(err => {
        resolve('');
      })
  })
}
