import React, { useEffect } from 'react';
import Taro from "@tarojs/taro";
import { View, Text } from '@tarojs/components';
import i18n from "@/utils/i18n";
import BasePage from "@/components/BasePage";

class User extends BasePage {
  constructor(props) {
    super(props);
    this.title = i18n.t('hello')
  }

  render() {
    return (
      <View className='index'>
        <View>{i18n.t('hello')}</View>
        <View>这是固定中文</View>
      </View>
    )
  }
}
export default User;
