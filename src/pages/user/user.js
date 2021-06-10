import React, { useEffect } from 'react';
import Taro from "@tarojs/taro";
import { View, Text } from '@tarojs/components';
import i18n from "@/utils/i18n";
import BasePage from "@/components/BasePage";

class User extends BasePage {
  constructor(props) {
    super(props);
    this.title = i18n.t('tabBar.user')
  }

  render() {
    return (
      <View className='index'>
        <Text>{i18n.t('tabBar.user')}</Text>
      </View>
    )
  }
}
export default User;
