import getUrl from "../api-config";
import http from "@/utils/httpRequest";
import i18n from "@/utils/i18n";

/**
 * 获取当前用户信息-可匿名
 * @returns {Promise<void>}
 */
export const getAnonymousUser = (params) => {
  return http(getUrl('user.loadUser'), {}, params);
}

/**
 * 切换语言
 * @param locale
 * @param params
 * @return {Promise<unknown>}
 */
export const switchLanguage = (locale, params) => {
  return http(getUrl('user.switchLanguage'), {
    locale: locale
  }, {
    headerType: 'form',
    ...params
  })
}
