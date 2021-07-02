import React  from 'react'
import Taro from "@tarojs/taro";
import i18n from "@/utils/i18n";
import {LanguageList, LanguageParam} from "@/constants/index";
import '@/styles/app.scss'
import {getUserInfo, isLogIn} from "@/utils/user";
import { findKey } from 'lodash';
import {getPageUrl, isTabBarPage} from "@/utils/page";
import {setGlobalData} from "@/utils/global";

class App extends React.Component {
  onLaunch() {
    this.watchGlobalError();
    this.getLanguage().then(res => {
      if (i18n.data.lang !== i18n.initLang) {
        let url = getPageUrl();
        if (url) {
          Taro.reLaunch({
            url
          })
        }
      }
    })
  }

  // 解决pc端小程序reLaunch的问题
  // https://developers.weixin.qq.com/community/develop/doc/0008c0a4a1c2585d26db9f2aa5b400?highLine=relaunch%2520%25E5%25BD%2593%25E5%2589%258D%25E9%25A1%25B5%25E9%259D%25A2
  initRelaunch = (platform) => {
    if (platform !== 'windows') return;
    const func = Taro.reLaunch;
    Taro.reLaunch = (obj) => {
      Taro.showLoading({
        title: i18n.t('http.loading')
      })
      func({
        url: '/pages/tips/loading/loading'
      })
      setTimeout(() => {
        Taro.hideLoading();
        func(obj);
      }, 100)
    }
  }

  getLanguage = async () => {
    let res = await getUserInfo(true);
    let lang = i18n.data.lang;
    let obj = Taro.getSystemInfoSync();
    setGlobalData('SystemInfo', obj);
    this.initRelaunch(obj.platform);
    if (isLogIn(res)) {
      let key = findKey(LanguageParam, item => item === res.locale);
      if (key) {
        lang = LanguageList[key];
        await i18n.initGlobalLanguage(LanguageList[key], true);
      } else {
        lang = LanguageList.ZH_CN;
        await i18n.initGlobalLanguage(LanguageList.ZH_CN);
      }
    } else {
      if(!obj || !obj.language) return;
      if (i18n.data.init) {
        lang = i18n.data.lang;
      } else {
        if (obj.language === LanguageList.EN) {
          lang = obj.language;
        } else {
          lang = LanguageList.ZH_CN;
        }
      }
      await i18n.initGlobalLanguage(lang);
    }
  }

  watchGlobalError() {
    Taro.onError(err => {
      // console.log('小程序出错', {
      //   errorMsg: err
      // });
      // Taro.showModal({
      //   title: i18n.t('error'),
      //   content: err || ''
      // })
    })
  }

  render() {
    return this.props.children;
  }
}

export default App
