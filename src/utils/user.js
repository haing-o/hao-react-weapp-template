/**
 * 用户信息相关
 */
import {getGlobalData, setGlobalData} from "@/utils/global";
import {getAnonymousUser} from "@/modules/common";
import ChainQueue from "@/utils/chainQueue";

/**
 * 获取用户信息
 */
let isGetUserIng = false;
const userChain = new ChainQueue();
export const getUserInfo = async (noCookie) => {
  let user = getGlobalData('user');
  if (user) return user;
  if(isGetUserIng) {
    return new Promise(resolve => {
      userChain.entryQueue(resolve);
    });
  }
  isGetUserIng = true;
  user = await getAnonymousUser({
    noCookie
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
