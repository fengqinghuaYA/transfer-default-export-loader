# transfer-default-export-loader

## background

假如我们项目中有如下代码：

```js
//constant.ts
export const A = "A";

export const B = "B";

...

//index.ts
import * as Names from './constants.ts';

export { Names };

...
//demo.ts
import { Names } from '../index.ts';

console.log(Names.A)
...
```

由于导出规则原因，并不能对**constant.ts**里的导出tree shaking,但是该文件很大时，可能会导致构建体积变得很大；

`transfer-default-export-loader` 是一个webpack loader，可以早前文提到的场景使得tree shaking很好的执行，减小打包体积；

## Getting Started

To begin, you'll need to install `transfer-default-export-loader`:

```console
$ npm install transfer-default-export-loader --save-dev 
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

