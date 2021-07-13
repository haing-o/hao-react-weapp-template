import React from 'react';
import Taro from "@tarojs/taro";
import { getCurrentInstance  } from "@tarojs/taro";
import * as echarts from "../ec-canvas/echarts";
import { uniqueId } from "lodash";

/**
 * echarts图表使用组件，自适应外部容器宽高
 * 使用时页面config必须添加以下配置
 *  usingComponents: {
 *    "ec-canvas": "@/components/ec-canvas/ec-canvas"
 *  }
 * 调用方法 setChartOption 传入 option，此方法必须在页面的onReady生命周期后调用
 */

class EChartsBox extends React.Component {
  $instance = getCurrentInstance();
  $domId = uniqueId('mychart-dom-area');
  constructor(props) {
    super(props);
  }
  state = {
    ec:{
      lazyLoad: true
    }
  }
  refChart = node => (this.Chart = node)

  setChartOption(option) {
    this.ecComponent = this.$instance.page.selectComponent('#' + this.$domId);
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      chart.setOption(option);
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  }

  render(){
    return (
      <ec-canvas
        ref={this.refChart}
        id={this.$domId}
        canvas-id="mychart-area"
        ec={this.state.ec}
        echarts={echarts}
        forceUseOldCanvas={true} // 使用旧的canvas 兼容pc端小程序
      />
    )
  }
}
export default EChartsBox;
