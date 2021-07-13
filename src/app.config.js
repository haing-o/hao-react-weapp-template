export default {
  pages: [
    'pages/home/home',
    'pages/list/list',
    'pages/detail/detail',
    'pages/user/user'
  ],
  subpackages: [
    {
      root: "echartsPackages",
      pages: [
        'page/page'
      ]
    }
  ],
  preloadRule: {
    'pages/home/home': {
      network: 'all',
      packages: ['echartsPackages']
    }
  },
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'HAO小程序',
    navigationBarTextStyle: 'black'
  },
  networkTimeout: {
    request: 60000
  },
  tabBar: {
    color: '#333333',
    selectedColor: '#0C83FA',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    position: 'bottom',
    list: [
      {
        pagePath: 'pages/home/home',
        text: '首页',
        iconPath: 'images/home-gray.png',
        selectedIconPath: 'images/home-blue.png'
      },
      {
        pagePath: 'pages/list/list',
        text: '列表',
        iconPath: 'images/achi-gray.png',
        selectedIconPath: 'images/achi-blue.png'
      },
      {
        pagePath: 'pages/user/user',
        text: '我的',
        iconPath: 'images/user-gray.png',
        selectedIconPath: 'images/user-blue.png'
      }
    ]
  },
  usingComponents: {
    'van-search': '@/vant/search/index',
    'van-icon': '@/vant/icon/index',
    'van-tab': '@/vant/tab/index',
    'van-tabs': '@/vant/tabs/index',
    "van-overlay": "@/vant/overlay/index",
    "van-image": "@/vant/image/index",
    "van-button": "@/vant/button/index",
    "van-loading": "@/vant/loading/index",
    "van-action-sheet": "@/vant/action-sheet/index",
  }
}
