import React from "react";
import { View, Text } from "@tarojs/components";
import './block.scss';
import classNames from "classnames";

const Block = React.memo(props => {
  return (
    <View className={classNames("block_box_h", props.customClass)}>
      {
        props.title &&
        <View className={"block_title"}>
          <View className={'blue_line'}/>
          <Text className={'title_text'}>{props.title}</Text>
        </View>
      }
      <View className={classNames('block_content', props.className)}>
        {props.children}
      </View>
    </View>
  )
})

export default Block;
