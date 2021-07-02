import Taro from "@tarojs/taro";
import {getCookie, getCookieHeader, setCookieFromHeader} from "@/utils/cookie";
import {handleRequestUrl} from "@/utils/httpRequest";

/**
 * 封装请求文件方法
 * @param url
 * @param noCookie
 * @return {Promise<unknown>}
 */
export const downloadFile = async (url, noCookie) => {
  let cookie = '';
  if (!noCookie) {
    cookie = await getCookie();
  }
  url = handleRequestUrl('', url);
  return new Promise((resolve, reject) => {
    Taro.downloadFile({
      header: getCookieHeader(cookie),
      url,
      success: async (res) => {
        await setCookieFromHeader(res);
        if (res.statusCode === 200) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        console.log('请求文件错误=> ', err);
        reject(err);
      }
    })
  })
}
