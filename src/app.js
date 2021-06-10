import React  from 'react'
import Taro from "@tarojs/taro";
import i18n from "@/utils/i18n";
import { LanguageList } from "@/constants/index";
import './styles/app.scss'

class App extends React.Component {
  onLaunch() {
    this.watchGlobalError();
    this.getLanguage();
  }

  getLanguage = async () => {
    let obj = Taro.getSystemInfoSync();
    if(!obj || !obj.language) return;
    if (obj.language === LanguageList.EN) {
      await i18n.initGlobalLanguage(obj.language);
    } else {
      await i18n.initGlobalLanguage(LanguageList.ZH_CN);
    }
  }

  watchGlobalError() {
    Taro.onError(err => {
      console.log('小程序出错', err);
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
