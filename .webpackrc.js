const path = require('path');
const config = require('./config.json');
export default {
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr',"@babel/transform-runtime"],
      html: {
        template: './src/index.ejs',
      },
    },
    production:{
      html: {
       template: './src/index.ejs',
       filename:path.resolve(__dirname, 'index.html')
      },
    }
  },
  browserslist:[
    "last 1 version",
    "> 1%",
    "IE 10",
    "IE 9"
  ],
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
    utils: path.resolve(__dirname, 'src/utils/'),
    assets: path.resolve(__dirname, 'src/assets')
  },
  externals: { "Hgis": "window.Hgis" ,localStorage:'window.localStorage',JSON:'window.JSON',"WdatePicker":"window.WdatePicker"},
  ignoreMomentLocale: true,
  disableDynamicImport: false,
  publicPath: '/',
  hash: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  copy: [
    {
      "from": "./src/assets/webplaywnd/index.js",
      "to": "./webplaywnd/index.js"
    },
    {
      "from": "./src/assets/logo/logo.png",
      "to": "./logo/logo.png"
    }
  ],
  proxy:{  
    "/disposition/object/feature/add/*":{  
      target:"http://192.168.105.203:80",  
      changeOrigin:true,  
      "pathRewrite": { "^/disposition/object/feature/add/" : "" }  
    },
    "/list_lib_info/import/*":{  
      target:"http://192.168.105.203:80",  
      changeOrigin:true,  
      "pathRewrite": { "^/list_lib_info/import/" : "" }  
    },
    "/gislayer/add/*":{  
      target:"http://192.168.110.23:80",  
      changeOrigin:true,  
      "pathRewrite": { "^/gislayer/add/" : "" }  
    },
  }
};
