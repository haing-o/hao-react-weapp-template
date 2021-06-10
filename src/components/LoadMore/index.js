import React, {useEffect} from "react";
import { View, Text } from "@tarojs/components";
import i18n from "@/utils/i18n";
import "./loadMore.scss"


/**
 * 加载更多组件
 * @param status {string}
 *   more 加载更多
 *   noMore 没有更多了
 *   loading 加载中
 *   error 加载出错
 */
const LoadMore = React.memo(props => {

  return (
    <View className={"load_more_box"}>
      {
        props.status === 'more' &&
          <Text onClick={props.onLoadMore}>{i18n.t('loadMore.more')}</Text>
      }
      {
        props.status === 'noMore' &&
          <Text>{i18n.t('loadMore.noMore')}</Text>
      }
      {
        props.status === 'loading' &&
          <View>
            <van-loading
              color={'#0c83fa'}
              type={'circular'}
              size={'36rpx'}
              textSize={'26rpx'}
            >
              {i18n.t('loadMore.loading')}
            </van-loading>
          </View>
      }
      {
        props.status === "error" &&
          <Text>{i18n.t('loadMore.error')}</Text>
      }
    </View>
  )
})

export default LoadMore
