import Taro from "@tarojs/taro";
import { BASE_URL } from "@/constants/baseUrl"
import { uniqueId, find } from "lodash";
import {getCookie, getCookieHeader, setCookieFromHeader} from "@/utils/cookie";
import i18n from "@/utils/i18n";
import {getUserInfo} from "@/utils/user";
import getUrl from "../api/api-config";

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
 *   @param noGetCookie {boolean} 默认为false, 是否不需要主动通过接口获取cookie
 *   @param noData {boolean} 默认为false, 是否不需要data
 *   @param params {object}: 其他需要传给小程序请求方法的配置
 * }
 * @returns {Promise<void>}
 */
let loadingId = 0;
const loadingPrefix = 'loading_http_';
let showHttpLoading = true;
const http = async (url = '', data = {}, config = {}) => {
  let currentId = uniqueId(loadingPrefix);
  if (!config.hideLoading && showHttpLoading) {
    loadingId = currentId;
    await Taro.showLoading({
      title: i18n.t('http.loading'),
      mask: true
    });
  }
  let cookie = await getCookie(config.noGetCookie);
  let user = {};
  if (!url.includes(getUrl('user.loadUser')) && (config.baseUrl || url.includes('http://') || url.includes('https://'))) {
    user = await getUserInfo();
  }
  return Taro.request({
    url: handleRequestUrl(config.baseUrl, url),
    data: config.noData ? undefined : data,
    header: config.header || Object.assign({
      "Content-Type": ContentType[config.headerType || 'json'],
    }, getCookieHeader(cookie), _getUserHeader(user)),
    dataType: 'json',
    method: HttpMethod[config.method || 'post'],
    ...(config.params || {} )
  })
    .then(async res => {
      // console.log('res', res);
      await setCookieFromHeader(res);
      if (!config.hideLoading && loadingId === currentId && showHttpLoading) {
        Taro.hideLoading();
      }
      switch (res.statusCode) {
        case 200:
          if(res.data && res.data.code === '0000') {
            return Promise.resolve(res.data);
          } else {
            if(!config.hideErrCodeMsg && res.data.codeMsg) {
              await Taro.showToast({
                title: res.data.codeMsg,
                icon: 'none',
                duration: 1000
              })
            }
            return Promise.reject(Object.assign({}, res, { requestSuccess: true }));
          }
        default:
          return Promise.reject(res);
      }
    })
    .catch(async err => {
      // console.log('err', err);
      if (_isRedirect(err)) {
        err.requestSuccess = false;
        err.statusCode = 302;
      }
      if (err.requestSuccess) {
        return Promise.reject(err);
      }
      if (!config.hideNetWorkErrMsg) {
        await _handleCatch(err);
        console.log('网络请求出错', url, err);
      }
      if (!config.hideLoading && loadingId === currentId && showHttpLoading) {
        Taro.hideLoading();
      }
      return Promise.reject(err);
    })
}

const _getUserHeader = (user) => {
  if (!user || Object.keys(user).length === 0) return {};
  return {
    'X_AUTO_USER_INFO_HEAD': encodeURI(JSON.stringify(user))
  }
}
const _isRedirect = (err) => {
  return typeof err.data === 'string' && err.data.includes('<!DOCTYPE html>');
}

/**
 * 全局设置http的loading开关 慎用，关了记得开
 * @param loading {boolean}
 */
export const setHttpLoading = (loading) => {
  showHttpLoading = !!(loading);
}

/**
 * 是否是请求超时
 * @param err
 * @return {boolean}
 */
export const isTimeoutErr = (err) => {
  return (!err.requestSuccess) && (!err.statusCode) && (err.errMsg.includes('fail'))
}

/**
 * 处理请求路径，如果包含了http或者https不会拼接
 * 如果存在自定义baseUrl, 自动清除后面的url的/api-的路由
 * @param baseUrl
 * @param url
 * @return {string}
 */
export const handleRequestUrl = (baseUrl, url) => {
  if (url.includes('http://') || url.includes('https://')) {
    if (!baseUrl) {
      return url;
    } else {
      url = url.replace(/^(http|https):\/\/.*?(\/.*)/, '$2');
    }
  }
  if(baseUrl) {
    url = url.replace(/\/api\-.*?(\/)/, '$1');
  }
  return `${baseUrl || BASE_URL}${url}`
}

/**
 * 处理请求错误
 * @param err
 * @private
 */
const _handleCatch = async (err) => {
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
