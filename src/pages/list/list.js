import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { getAnonymousUser } from '../../api/modules/common';
import i18n from "@/utils/i18n";
import BasePage from "@/components/BasePage";
import ListPage from "@/components/ListPage";

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
      tabListData: [
        {title: '项目', mainId: 1},
        {title: '文件', mainId: 2},
        {title: '编辑', mainId: 3},
        {title: '工具', mainId: 4}
      ]
    }
    this.title = i18n.t('tabBar.list');
  }

  componentDidMount() {

  }

  render() {
    return (
      <View className='index'>
        <ListPage
          tabListData={this.state.tabListData}
          renderItem={() => <Text>wow</Text>}
          params={{
            url: 'list.list',
            keywordKey: 'title',
            tabKey: 'mainId'
          }}
        />
      </View>
    )
  }
}
export default Demo;
