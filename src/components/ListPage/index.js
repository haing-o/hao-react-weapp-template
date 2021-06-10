import React from 'react'
import Taro from "@tarojs/taro"
import {Image, ScrollView, Slot} from "@tarojs/components"
import i18n from "@/utils/i18n";
import classNames from "classnames";
import { View, Text } from '@tarojs/components'
import OverLay from "@/components/Overlay";
import "./listPage.scss";
import http from "@/utils/httpRequest";
import getUrl from "../../api/api-config";
import {sleep} from "@/utils/tool";
import ListItem from "@/components/ListItem";
import {getDictList} from "@/modules/common";
import {DICT_TYPE} from "@/constants/index";
import {getUserInfo} from "@/utils/user";
import LoadMore from "@/components/LoadMore";

/**
 * 通用列表页面，使用时请在页面的配置文件中设置页面禁止滚动。disableScroll: false
 * @param title {array} 数组，第一项为中文，第二项为英文
 * @param tabListData {array} tab列表
 * @param showAllTab {boolean} 是否显示"全部“tab，默认true
 * @param params {object} 列表请求相关参数
 * {
 *   @param url {string} api-config中定义的值
 *   @param keywordKey {string} 输入框中关键词请求的参数key, 默认keyword
 *   @param tabKey {string} 切换tab时请求的参数key，默认tabValue
 *   @param pageSize {number} 一次加载的数量，默认为20
 *   @param queryParams {object} 其他请求参数
 * }
 * @param renderItem {function} 参数为单条数据item, 默认使用<ListItem/>组件
 */

class ListPage extends React.Component {
  static defaultProps = {
    title: [],
    tabListData: [],
    showAllTab: true,
    params: {},
  }
  constructor(props) {
    super(props);
    this.state = {
      systemInfo: {},
      user: null,
      keyword: '',
      tabValue: '',
      showTab: false,
      showShadow: false,
      pageNum: 1,
      dataList: [],
      listRefreshStatus: true,
      loadMoreStatus: 'loading',
      loading: false,
      tabList: []
    }
  }

  componentDidMount() {
    let { tabListType, tabListData } = this.props;
    if (tabListType) {
      this.getTabList();
    } else if(tabListData && tabListData.length > 0){
      this.initTabListData(tabListData);
    }
    this.getWindowHeight();
    this.getList();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.tabListData !== this.props.tabListData && nextProps.tabListData.length > 0) {
      this.initTabListData(nextProps.tabListData);
    }
  }

  initTabListData = (tabList) => {
    if (!tabList || !tabList.length > 0) return;
    if (this.props.showAllTab) {
      tabList = [{
        title: i18n.t('listPage.all'),
        mainId: 'all'
      }].concat(tabList)
    }
    this.setState({
      showTab: true,
      tabValue: tabList[0].mainId,
      tabList,
    })
  }

  getWindowHeight = () => {
    Taro.getSystemInfo().then(info => {
      this.setState({
        systemInfo: info
      })
    })
  }

  getList = async (refresh, showLoading) => {
    let { pageNum, dataList, loadMoreStatus, keyword, tabValue, user, loading } = this.state;
    let { params } = this.props;
    let { url = '', pageSize = 20, keywordKey = 'keyword', tabKey = 'tabValue', queryParams = {} } = params;
    if (refresh) {
      pageNum = 1;
    }
    return new Promise((resolve) => {
      http(getUrl(url), {
        pageSize,
        pageNum,
        [keywordKey]: keyword,
        [tabKey]: tabValue === 'all' ? '' : tabValue,
        ...queryParams
      }, {
        hideLoading: !showLoading
      }).then(res => {
        if(res.data) {
          loadMoreStatus = 'more';
          if(refresh) {
            dataList = [];
          }
          dataList = dataList.concat(res.data);
          if (res.page && (dataList.length === res.page.totalCount)) {
            loadMoreStatus = 'noMore';
          }
          this.setState({
            dataList,
            loadMoreStatus,
            pageNum
          }, () => {
            resolve();
          })
        }
      })
        .catch(err => {
          loadMoreStatus = 'error';
          this.setState({
            loadMoreStatus
          })
        })
    })
  }

  onChangeTabValue = (event) => {
    let name = event.detail.name;
    this.setState({
      tabValue: name
    }, () => {
      this.toggleFoldTab(true);
      this.getList(true, true);
    })
  }

  toggleFoldTab = (close) => {
    let { showShadow } = this.state;
    this.setState({
      showShadow: typeof close === 'boolean' ? !close : !showShadow
    })
  }

  onInputChange = (e) => {
    let value = e.detail;
    this.setState({
      keyword: value
    });
  }

  onInputConfirm = () => {
    this.getList(true, true);
  }

  onInputClear = (e) => {
    this.setState({
      keyword: ''
    }, () => {
      this.getList(true, true);
    })
  }

  onListRefresh = (e) => {
    this.setState({
      listRefreshStatus: true,
      loadMoreStatus: 'loading'
      // dataList: []
    },  async () => {
      await this.getList(true);
      this.setState({
        listRefreshStatus: false
      })
    })
  }

  onListScrollToLower = (e) => {
    let { pageNum, loadMoreStatus } = this.state;
    if (loadMoreStatus === 'noMore' || loadMoreStatus === 'loading') return;
    this.setState({
      pageNum: pageNum + 1,
      loadMoreStatus: 'loading'
    }, async () => {
      // await sleep(2000)
      await this.getList()
    })
  }

  render() {
    let { tabList, systemInfo, keyword, tabValue, showTab, showShadow, dataList, listRefreshStatus, loadMoreStatus } = this.state;
    console.log('tabList', tabList);
    return (
      <View className={'common_list_page'} style={{ height: systemInfo.windowHeight || 500 }}>
        <View className={'inputBox'}>
          <van-search
            customClass={'input'}
            value={keyword}
            customStyle={'background-color: #f0f0f0;'}
            placeholderStyle={'font-size: 26rpx; color: #b3b3b3'}
            clearable={true}
            shape="round"
            placeholder={i18n.t('listPage.searchKeyword')}
            onSearch={this.onInputConfirm}
            onChange={this.onInputChange}
            onClear={this.onInputClear}
          />
        </View>
        <View className={'fold_tabs_box'}>
          {
            showTab &&
            <View className={'tabsBox'}>
              <van-tabs active={tabValue}
                        ellipsis={false}
                        color={'#0c83fa'}
                        titleActiveColor={'#0c83fa'}
                        titleInactiveColor={'#595959'}
                        tabActiveClass={'tab_active_class'}
                        onChange={this.onChangeTabValue}
              >
                {
                  tabList.map((item, index) => {
                    return (
                      <van-tab name={item.mainId}
                               title={item.title}
                      />
                    )
                  })
                }
              </van-tabs>
            </View>
          }
          <View className={'fold-icon-box'}>
            <Image className={"icon_shadow"} src={require('@/images/shadow.png')}/>
            <van-icon
              customClass={'fold-icon'}
              name={showShadow ? 'arrow-up' : 'arrow-down'}
              onClick={this.toggleFoldTab}/>
          </View>

          <View className={"tab_list_grid"} style={{ display: showShadow ? 'flex' : 'none' }}>
            {
              tabList.map((item, index) => {
                return (
                  <View
                    onClick={() => {
                      this.setState({
                        tabValue: item.mainId
                      })
                    }}
                    className={classNames("tab_list_grid_item", {
                      "long_item": item.title.length > 4 || i18n.isEn(),
                      "check_item": item.mainId === tabValue
                    })}
                  ><Text className={"text"}>{item.title}</Text></View>
                )
              })
            }
          </View>
        </View>
          <View className={"list_view"}>
            <OverLay show={showShadow} onClick={this.toggleFoldTab}/>
            {
              dataList.length > 0 || loadMoreStatus !== 'loading' ?
                <ScrollView style={{height: '100%'}}
                            scrollY={true}
                            scrollAnchoring={true}
                            refresherEnabled={true}
                            onRefresherRefresh={this.onListRefresh}
                            refresherTriggered={listRefreshStatus}
                            onScrollToLower={this.onListScrollToLower}
                            lowerThreshold={300}
                            enableBackToTop={true}>
                  {
                    dataList.length > 0 && dataList.map((item, index) => {
                      let {renderItem} = this.props;
                      if (renderItem) {
                        return renderItem(Object.assign({}, item, {index}))
                      }
                      return <ListItem key={item.id} {...item}/>
                    })
                  }
                  <View>
                    <LoadMore
                      onLoadMore={this.onListScrollToLower}
                      status={loadMoreStatus}
                    />
                  </View>
                </ScrollView>
                :
                <View>
                  <LoadMore
                    onLoadMore={this.onListScrollToLower}
                    status={loadMoreStatus}
                  />
                </View>
            }
          </View>
      </View>
    )
  }
}

export default ListPage;

