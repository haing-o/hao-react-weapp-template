import React from 'react';
import Taro from "@tarojs/taro";
import { View, Text, Slot } from '@tarojs/components';
import i18n from "@/utils/i18n";
import BasePage, {withShare} from "@/components/BasePage";
import EChartsBox from "../EChartsBox";

@withShare
class TradingCenter extends BasePage {
  constructor(props) {
    super(props);
    this.state = {
      ec: {

      }
    }
    this.title = i18n.t('hello');
  }

  componentDidMount() {
  }

  onReady() {
    const option = {
      backgroundColor: "#ffffff",
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['20%', '40%'],
        data: [{
          value: 55,
          name: '北京'
        }, {
          value: 20,
          name: '武汉'
        }, {
          value: 10,
          name: '杭州'
        }, {
          value: 20,
          name: '广州'
        }, {
          value: 38,
          name: '上海'
        }]
      }]
    };
    this.statsRef.setChartOption(option);
  }

  statsRefFn = (node) => this.statsRef = node
  render() {
    return (
      <View>
        <View style={{width: '100%', height: Taro.pxTransform(600)}}>
          <EChartsBox ref={this.statsRefFn} />
        </View>
      </View>
    )
  }
}
export default TradingCenter;
