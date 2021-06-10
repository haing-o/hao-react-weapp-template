const path = require('path')  // 加在最上面

const config = {
  projectName: 'hao-weapp',
  date: '2021-5-26',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {
  },
  alias: {
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/constants': path.resolve(__dirname, '..', 'src/constants'),
    '@/images': path.resolve(__dirname, '..', 'src/images'),
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/modules': path.resolve(__dirname, '..', 'src/api/modules'),
    '@/vant': path.resolve(__dirname, '..', 'src/components/Vant'),
    '@/styles': path.resolve(__dirname, '..', 'src/styles'),
  },
  copy: {
    patterns: [
      { from: 'src/components/Vant/', to: 'dist/components/Vant/', ignore: ['*.js', '*.wxml', '*.json', '*.wxss', '*.d.ts'] }, // 指定需要 copy 的目录
    ],
    options: {
    }
  },
  framework: 'react',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: [/van-/]
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
