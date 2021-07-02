import getUrl from "../api-config";
import http from "@/utils/httpRequest";
import i18n from "@/utils/i18n";

/**
 * 获取当前用户信息-可匿名
 * @returns {Promise<void>}
 */
export const getAnonymousUser = (params) => {
  // 测试数据-start
  return Promise.resolve({
    data: {
      username: '游客'
    }
  });
  // 测试数据-end
  return http(getUrl('user.loadUser'), {}, params);
}

/**
 * 切换语言
 * @param locale
 * @param params
 * @return {Promise<unknown>}
 */
export const switchLanguage = (locale, params) => {
  // 测试数据-start
  return Promise.resolve({
    data: {
      code: '0000'
    }
  });
  // 测试数据-end
  return http(getUrl('user.switchLanguage'), {
    locale: locale
  }, {
    headerType: 'form',
    ...params
  })
}
