import Taro from "@tarojs/taro";
import {objToUrlParam} from "@/utils/url";
import {TabBarList_page} from "../i18n/config";

/**
 * 获取当前页面
 * @return {Taro.Page}
 */
export const getCurrentPage = () => {
  const pages = Taro.getCurrentPages();
  if (pages.length === 0) return {};
  return pages[pages.length - 1];
}

/**
 * 获取页面完整路径
 * @param vt 页面，不传时默认当前页面
 * @return {string}
 */
export const getPageUrl = (vt) => {
  if (!vt) {
    vt = getCurrentPage();
  }
  try {
    if (!vt) return '';
    const d = vt.__displayReporter;
    if (d.query && Object.keys(d.query).length > 0) {
      return '/' + d.route + '?' + objToUrlParam(d.query);
    }
    return '/'+ d.route;
  } catch (err) {
    console.log('getPageUrl Error', err);
    return ''
  }
}

/**
 * 是否是tabBar页面
 * @param page 不传时默认为当前页面
 * @return {boolean}
 */
export const isTabBarPage = (page) => {
  return !!(TabBarList_page.find(item => item.pagePath.includes(page || getCurrentPage().route)))
}

