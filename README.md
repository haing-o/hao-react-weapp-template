## 关于这个分支
1. 引入[echarts-for-weixin](https://github.com/ecomfe/echarts-for-weixin)
2. 将`echarts`做了分包。
3. 提供`EChartsBox`组件方便调用。
4. 基于`Taro3`对`echarts-for-weixin`的`ec-canvas.js`文件做了小调整，将`echarts`对象通过外部传入，方便分包。
```js
import * as echarts from "../ec-canvas/echarts";
<ec-canvas
  echarts={echarts}
/>
```
5. 默认的`echarts.js`文件包含的图表较少，可根据需要自定义或更新`echarts`，直接覆盖`echarts.js`文件即可。
[最新发布版](https://github.com/apache/echarts/releases)
或
[官网自定义构建](https://echarts.apache.org/zh/builder.html)

## 基础文档

- [小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- 基础开发框架：[Taro](https://taro-docs.jd.com/taro/docs/README)
  使用 `React`语法。
- UI框架：[Vant Weapp](https://youzan.github.io/vant-weapp/#/home)
  使用须知请看下方`使用UI框架Vant`（请尽量使用这些基础组件）。
- 使用`scss`编写样式文件，统一使用`px`单位。

# 小程序开发流程

## 1. 下载[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

打开选择项目根目录。
需要注意开发者工具的项目设置（右上角点击详情-本地设置）：

- 需要设置关闭 ES6 转 ES5 功能，开启可能报错

- 需要设置关闭上传代码时样式自动补全，开启可能报错

- 需要设置关闭代码压缩上传，开启可能报错

- 需要设置开启不校验合法域名、web-view（业务域名）......以及HTTPS证书。

## 2. 项目运行命令

- `npm install`安装依赖。

- `npm run dev`为本地编译调试，含代码监听自动预览，代码未压缩。

- `npm run build`为本地编译打包，代码经过压缩。

> `dev`的包体积几乎为`build`的两倍，所以需要真机调试但是发现包体积过大时，可以在`app.config.js`中暂时注释一部分页面（tabBar页面必须保留，一般是前四个页面），然后重新`npm run dev`，即可得到较小的包从而进行真机调试。

## 3. 项目目录结构

```js
├─src                   //  项目目录
│  ├─app.config.js          //  小程序全局配置
│  ├─app.js                 //  初始化页面
│  ├─api                    //  数据请求
│  │  ├─modules             //  各个模块封装的请求方法
│  │  ├─api-config.js       //  请求路径
│  ├─component              //  业务组件
│  ├─constant               //  常量
│  ├─i18n               	//  国际化
│  ├─images                 //  图片资源
│  ├─pages                 //  业务页面
│  │  ├─demo             	//  demo页面
│  │  │	├─demo.js    		// demo页面业务代码
│  │  │	├─demo.config.js    //  demo页面的配置文件
│  │  │	├─demo.scss    		//  demo页面样式文件
│  ├─styles                 //  公共样式
│  │  ├─custom-theme.scss   //  css公共变量与方法
│  │  ├─app.scss       		//  全局样式
│  └─utils                  //  工具
└─config                	//  项目打包配置
```

## 4. 创建新页面-可参考pages/demo文件夹(请打开demo.js查看注释)

1. 在`src/pages/`中创建文件夹，至少包括一个`js`文件，文件命名即为之后的路径名。

   必须使用class语法并继承`BasePage`组件，方便统一设置分享/标题/中英文切换等。

2. `app.config.js`的`pages`中配置页面路径，路径即为上一步创建的`js`文件路径。

## 5. 使用UI框架Vant

1. 页面的配置文件`*.config.js`的`usingComponents`增加需要的组件，样例可看`app.config.js`

   ```js
     usingComponents: {
       'van-icon': '@/vant/icon/index'
     }
   ```

   > 如果是自定义组件需要引入，需要在全局`app.config.js`安装。

2. 直接在`render`中使用。

   ```js
   <van-icon name="location-o" color={'#0c83fa'} size={Taro.pxTransform(48)}/>
   ```

3. 使用时注意传递的**参数**全部变为驼峰式，例如`min-date`应写为`minDate`。
4. 如果需要传递函数式参数时，请参考以下写法，以`van-calendar`的`formatter`参数为例。
    ```js
    export default class Index extends Component {
      el = React.createRef()
    
      onReady () {
        this.el.current.setAttribute('formatter', this.formatter)
      }
    
      formatter () {
        return function (day) {
          console.log('formatter', day)
        }
      }
    
      render () {
        return (
          <View>
            <van-calendar ref={this.el} show={true} />
          </View>
        )
      }
    }
    ```
# 注意事项

1. 小程序对包体积有要求，所以在引入第三方方法时，尽量不要引入整个模块。正确和错误示范：

   ```js
   import { findKey } from 'lodash' // 对
   import _ from 'lodash' // 错
   ```

2. 使用到的工具包

- [Loadash](https://www.lodashjs.com/)
  一个JavaScript 实用工具库。
- [Day.js](https://dayjs.gitee.io/zh-CN/)
  一个轻量的处理时间和日期的 JavaScript 库。

3. 在`JS`文件中写样式包含`px`时，使用 `Taro.pxTransform` 。

   但是实际换算的结果与直接在scss文件中编写的换算结果有时候并不完全一致。

   **所以尽量在scss样式文件内写样式。**

4. 尽量写上注释，起码标注出当前文件的意义。

5. 在开发前，请先大致了解`components`中的公共组件(包括`Vant`提供的组件)与`utils`中的公共方法，减少代码重复率。

6. 遇到问题优先搜索小程序官方文档和社区。



