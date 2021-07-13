import React from "react";
import i18n from "@/utils/i18n";
import {getUserInfo, isLogIn} from "@/utils/user";
import Taro from "@tarojs/taro";

/**
 * 基础页面
 * 通过this.title设置标题, 请传入获取的路径而不是获取后的内容
 * 例如 this.title = "login.modify"
 */

class BasePage extends React.Component {
  onLoad() {
    this._base_handleLogin();
    this._base_initPage(this.title);
  }

  _base_initPage = (title) => {
    i18n.initNavBarTitle(_handleTitle(title));
  }

  _base_handleLogin = async () => {}

}

/**
 * 默认的分享配置，需要自定义时请取消
 * 例如 @withShare
 * @param WrappedComponent
 */
export function withShare(WrappedComponent) {
  return class Index extends WrappedComponent {
    onShareAppMessage(res) {
      return {
        title: _handleTitle(this.title)
      }
    }
    onShareTimeline(res) {
      return {
        title: _handleTitle(this.title)
      }
    }
  }
}

/**
 * 验证是否登录
 * 例如 @withLogin
 * @param WrappedComponent
 */
export function withLogin(WrappedComponent) {
  return class Index extends WrappedComponent {
    _base_handleLogin = async () => {
      let user = await getUserInfo();
      if(!isLogIn(user)) {
        Taro.redirectTo({
          url: '/pages/login/login'
        })
      }
    }
  }
}

const _handleTitle = (title) => {
  return title || i18n.t('hello')
}

export default BasePage;
