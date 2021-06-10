import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { getAnonymousUser } from '../../api/modules/common';
import i18n from "@/utils/i18n";
import BasePage from "@/components/BasePage";

/**
 * demo页面
 * 继承BasePage
 * 设置this.title, 用于导航/分享
 * 请不要轻易重写onLoad方法，如果需要记得添加super.onLoad();
 * getUser方法为请求示例
 */

class Demo extends BasePage {
  constructor(props) {
    super(props);
    this.state = {

    }
    const app = Taro.getApp();
    this.title = i18n.t('tabBar.list');
  }

  render() {
    return (
      <View className='index'>
        <Text>{i18n.t('tabBar.list')}</Text>
      </View>
    )
  }
}
export default Demo;
