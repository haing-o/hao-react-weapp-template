import React from "react";
import {View} from "@tarojs/components";

/**
 * 自定义遮罩组件
 * 遮罩范围的父组件需要设置position: relative
 * @param zIndex 默认为9
 * @param onClick 点击遮罩事件
 */

const OverLay = React.memo(props => {
  const styles = {
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#000000',
      overflow: 'hidden',
      opacity: 0.3,
      display: props.show ? 'block' : 'none',
      zIndex: props.zIndex || 9
    }
  }
  return (
    <View
      catchMove
      style={styles.overlay}
      onClick={() => {
        props.onClick && props.onClick()
      }}
    />
  )
})

export default OverLay;
