/**
 * 用户信息相关
 */
import {getGlobalData, setGlobalData} from "@/utils/global";
import {getAnonymousUser} from "@/modules/common";
import ChainQueue from "@/utils/chainQueue";
import enCodeAndDecode from "@/utils/enCodeAndDecode";
import {clearCookie} from "@/utils/cookie";
import Taro from "@tarojs/taro";

let isGetUserIng = false;
const userChain = new ChainQueue();
/**
 * 获取用户信息
 * @param reset {boolean} 是否强制重新请求
 */
export const getUserInfo = async (reset = false) => {
  let user = getGlobalData('user');
  if (user && !reset) return user;
  if(isGetUserIng) {
    return new Promise(resolve => {
      userChain.entryQueue(resolve);
    });
  }
  isGetUserIng = true;
  user = await getAnonymousUser({
    noGetCookie: true
  });
  isGetUserIng = false;
  if (user.data) {
    user = user.data;
    setGlobalData('user', user);
    userChain.executeQueue(resolve => {
      resolve(user);
    });
  } else {
    Promise.reject(new Error('获取用户信息出错'));
    return false;
  }
  return user;
}

/**
 * 是否是登陆状态
 * @return {boolean}
 */
export const isLogIn = (user) => {
  if (!user) return false;
  return !!(user.userAccount);
}

export const logoutWeapp = async () => {
  await clearCookie();
  const App = Taro.getApp().$app;
  await App.getLanguage();
}

/**
 * 加密密码
 * @param value
 * @return {*}
 */
export const codePassword = (value) => {
  return enCodeAndDecode.base64encode(enCodeAndDecode.utf16to8(value));
}
