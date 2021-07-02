import Taro from "@tarojs/taro";
import {deleteGlobalData, getGlobalData, setGlobalData} from "@/utils/global";
import {getUserInfo} from "@/utils/user";
import ChainQueue from "@/utils/chainQueue";
import {find} from "lodash";
const cookieChain = new ChainQueue();

export const CookieName = 'ZUULBUSISESSION-CATTP';
export const CookieKey = 'Cookie';
const TIME_VALID = 7 * 24 * 60 * 60 * 1000;
/**
 * 保存cookie
 * @param cookie
 * @param validTime {number} 有效时间，默认七天
 * @return {Promise}
 */
export const setCookie = (cookie, validTime = TIME_VALID) => {
  console.log('setCookie=>', cookie);
  setGlobalData(CookieKey, cookie);
  return Taro.setStorage({
    key: CookieKey,
    data: {
      cookie,
      expireTime: Date.now() + validTime
    }
  })
}

let isGetCookie = false;
/**
 * 自动获取cookie
 * @param noGetCookie 是否不主动请求接口获取cookie
 * @return {Promise<*>}
 * @private
 */
export const getCookie = async (noGetCookie) => {
  let cookie = getGlobalData(CookieKey);
  if (!cookie) {
    cookie = await getCookieStorage();
    if (!cookie && !noGetCookie) {
      if (isGetCookie) {
        await new Promise(resolve => {
          cookieChain.entryQueue(resolve);
        })
        cookie = getGlobalData(CookieKey);
      } else {
        isGetCookie = true;
        await getUserInfo(true);
        isGetCookie = false;
        cookie = getGlobalData(CookieKey);
        cookieChain.executeQueue(resolve => {
          resolve();
        })
      }
    }
    if (cookie) {
      setGlobalData(CookieKey, cookie);
    }
  }
  return Promise.resolve(cookie);
}

/**
 * 清除cookie
 * @return {Promise<Taro.General.CallbackResult>}
 */
export const clearCookie = async () => {
  deleteGlobalData(CookieKey);
  return Taro.removeStorage({
    key: CookieKey
  })
}

/**
 * 获取cookie
 * @return {Promise}
 */
export const getCookieStorage = () => {
  return new Promise(resolve => {
    Taro.getStorage({
      key: CookieKey
    }).then(async res => {
      if(res && res.data && res.data.cookie) {
        if (res.data.expireTime && Date.now() < res.data.expireTime) {
          console.log('getCookie=>', res.data.cookie);
          resolve(res.data.cookie);
        } else {
          console.log('Cookie Overdue=>', res.data.expireTime);
          await clearCookie();
          resolve('');
        }
      } else {
        resolve('');
      }
    })
      .catch(err => {
        resolve('');
      })
  })
}

/**
 * 获取cookie头用于发送请求
 * @param cookie
 * @return {{Cookie: string}}
 */
export const getCookieHeader = (cookie) => {
  if (!cookie) return {};
  return {
    "Cookie": CookieName + '=' + cookie
  };
}

/**
 * 根据set-cookie设置cookie
 * @param res
 */
export const setCookieFromHeader = async (res) => {
  if(res.header && res.header['Set-Cookie']) {
    let cookie = _extractCookie(res.header['Set-Cookie']);
    await setCookie(cookie);
  }
}

const _extractCookie = (data) => {
  let item = find(data.split(';'), e => e.includes(CookieName));
  return item.split('=')[1];
}
