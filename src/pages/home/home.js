import React, { useEffect } from 'react';
import Taro from "@tarojs/taro";
import { View, Text } from '@tarojs/components';
import i18n from "@/utils/i18n";
import {LanguageList} from "@/constants/index";
import {getPageUrl} from "@/utils/page";
import BasePage from "@/components/BasePage";

class Home extends BasePage {
  constructor(props) {
    super(props);
    // this.title = i18n.t('tabBar.home');
  }

  onClickSwitch = async () => {
    if (i18n.data.lang === LanguageList.EN) {
      await i18n.initGlobalLanguage(LanguageList.ZH_CN);
    } else {
      await i18n.initGlobalLanguage(LanguageList.EN);
    }
    let url = getPageUrl();
    if (url) {
      Taro.reLaunch({
        url
      })
    }
  }

  render() {
    return (
      <View className='index'>
        <View>{i18n.t('hello')}</View>
        <View>
          <van-button
            onClick={this.onClickSwitch}
            type={'primary'}
          >切换语言</van-button>
        </View>
        <View>
          <van-button
            onClick={() => {
              Taro.navigateTo({
                url: '/pages/detail/detail'
              })
            }}
            type={'info'}
          >跳转页面</van-button>
        </View>
        <View>
          <van-button
            onClick={() => {
              Taro.navigateTo({
                url: '/echartsPackages/page/page'
              })
            }}
            type={'warning'}
          >Echarts页面</van-button>
        </View>
      </View>
    )
  }
}

export default Home;
