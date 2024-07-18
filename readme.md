# file-loader

## background
魔方前端项目会根据swqa的接口文档生成类型文件，为每个接口提供类型提示；

但是，由于导出规则原因，记录接口名称的文件内的导出没被tree shaking，从而导致包体积较大；

`transfer-default-export-loader` 用于tree shaking 掉未被使用到的接口名称，减小打包体积；

## Getting Started

To begin, you'll need to install `transfer-default-export-loader`:

```console
$ npm install transfer-default-export-loader --save-dev --registry=http://artifactory.gz.cvte.cn/artifactory/api/npm/cvte-npm-registry/
```


Then add the loader to your `webpack` config. For example:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(tsx|ts|js|jsx)$/i,
        use: [
          {
            loader: 'transfer-default-export-loader',
            options:{
                patterns:{
                    exportName:"WebHttp",
                    importPaths:["@/def","def/web"],
                    originPath:"'def/web/http.constant'"
                }
            }
          },
        ],
      },
    ],
  },
};
```

