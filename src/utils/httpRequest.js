import Taro from "@tarojs/taro";
import { BASE_URL } from "@/constants/baseUrl"
import { uniqueId, find } from "lodash";
import {CookieName, getCookieStorage, setCookieStorage} from "@/utils/cookie";
import {getGlobalData, setGlobalData} from "@/utils/global";
import ChainQueue from "@/utils/chainQueue";
import {getAnonymousUser} from "@/modules/common";
import {getUserInfo} from "@/utils/user";
import i18n from "@/utils/i18n";
const cookieChain = new ChainQueue();

/**
 * http请求接口方法
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 * @param {object} config 请求配置
 * {
 *   @param hideLoading {boolean}: 默认为false，是否显示全局loading
 *   @param hideErrCodeMsg {boolean}: 默认为false，是否隐藏接口出错提示
 *   @param hideNetWorkErrMsg {boolean}: 默认为false，网络错误时是否隐藏弹窗
 *   @param headerType {string}: 默认为json，请求头中Content-Type的值，可选值为json/form，具体请看ContentType枚举
 *   @param method {string}: 默认为post，请求方法，可选值为get/post/...，具体请看HttpMethod枚举
 *   @param baseUrl {string}: 默认取BASE_URL，方便调试，可自定义基础路径
 *   @param noCookie {boolean} 默认为false, 是否不需要cookie
 *   @param noData {boolean} 默认为false, 是否不需要data
 *   @param params {object}: 其他需要传给小程序请求方法的配置
 * }
 * @returns {Promise<void>}
 */
let loadingId = 0;
let loadingPrefix = 'loading_http_';
let isGetCookie = false;
let cookieKey = 'Cookie';
const http = async (url = '', data = {}, config = {}) => {
  let currentId = uniqueId(loadingPrefix);
  if (!config.hideLoading) {
    loadingId = currentId;
    await Taro.showLoading({
      title: i18n.t('http.loading'),
      mask: true
    });
  }
  let cookie = getGlobalData(cookieKey);
  if(!config.noCookie) {
    if (!cookie) {
      cookie = await getCookieStorage();
      if (!cookie) {
        if (isGetCookie) {
          await new Promise(resolve => {
            cookieChain.entryQueue(resolve);
          })
        } else {
          isGetCookie = true;
          await getUserInfo(true);
          isGetCookie = false;
          cookie = getGlobalData(cookieKey);
          cookieChain.executeQueue(resolve => {
            resolve();
          })
        }
      }
      setGlobalData(cookieKey, cookie);
    }
  }
  return Taro.request({
    url: `${config.baseUrl || BASE_URL}${url}`,
    data: config.noData ? undefined : data,
    header: config.header || Object.assign({
      "Content-Type": ContentType[config.headerType || 'json'],
    }, (!config.noCookie && cookie) ? {
      "Cookie": CookieName + '=' + cookie
    }: {}),
    dataType: 'json',
    method: HttpMethod[config.method || 'post'],
    ...(config.params || {} )
  })
    .then(async res => {
      // console.log('res', res);
      if(res.header && res.header['Set-Cookie']) {
        let cookie = _extractCookie(res.header['Set-Cookie']);
        setGlobalData(cookieKey, cookie);
        await setCookieStorage(cookie);
      }
      if (!config.hideLoading && loadingId === currentId) {
        Taro.hideLoading();
      }
      switch (res.statusCode) {
        case 200:
          if(res.data && res.data.code === '0000') {
            return Promise.resolve(res.data);
          } else {
            if(!config.hideErrCodeMsg) {
              await Taro.showToast({
                title: res.data.codeMsg,
                icon: 'none',
                duration: 1000
              })
            }
            return Promise.reject(Object.assign({}, res.data, { requestSuccess: true }));
          }
        default:
          return Promise.reject(res);
      }
    })
    .catch(async err => {
      // console.log('err', err);
      if (err.requestSuccess) {
        return Promise.reject(err);
      }
      if (!config.hideNetWorkErrMsg) {
        await _handleCatch(err);
      }
      console.log('网络请求出错', url, err);
      return Promise.reject(err);
    })
}

/**
 * 处理请求错误
 * @param err
 * @private
 */
const _handleCatch = (err) => {
  if (Object.keys(err).length === 0) return;
  if (err.statusCode) {
    Taro.showModal({
      content: i18n.t('http.errorCode') + err.statusCode,
    });
  } else {
    Taro.showModal({
      content: i18n.t('http.errorMsg') + err.errMsg,
    });
  }
}

const _extractCookie = (data) => {
  let item = find(data.split(';'), e => e.includes(CookieName));
  return item.split('=')[1];
}


const ContentType = {
  json: "application/json; charset=UTF-8",
  form: "application/x-www-form-urlencoded; charset=UTF-8",
};

const HttpMethod = {
  get: "GET",
  post: "POST",
  put: "PUT",
  patch: "PATCH",
  delete: "DELETE"
};

export default http;
