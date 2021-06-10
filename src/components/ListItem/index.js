import React from "react";
import {Text, View} from "@tarojs/components";
import './listItem.scss'

/**
 * 通用的item样式
 * 需要修改时可从这里复制布局代码，并引入listItem.scss
 */

const ListItem = React.memo(item => {
  return (
    <View className={'list_item'}>
      <View className={"text_box"}>
        <Text className={"name"}>{item.name}</Text>
        <Text className={"type"}>{item.type}</Text>
      </View>
    </View>
  )
})

export default ListItem;
