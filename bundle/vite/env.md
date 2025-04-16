---
layout: doc
outline: deep
---
## 内置的环境变量
Vite 在一个特殊的 import.meta.env 对象上暴露环境变量

https://vitejs.cn/vite3-cn/guide/env-and-mode.html#env-variables
## 生产环境替换
在引用它们时请使用完全静态的字符串。动态的 key 将无法生效

## .env 文件（配置）
```js
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```
越具体优先级越高

另外，Vite 执行时已经存在的环境变量有最高的优先级，不会被 .env 类文件覆盖。例如当运行 VITE_SOME_KEY=123 vite build 的时候。

加载的环境变量也会通过 import.meta.env 以字符串形式暴露给客户端源码（以 VITE_ 为前缀的变量才会暴露）

## ts的智能提示
https://vitejs.cn/vite3-cn/guide/env-and-mode.html#env-files

## 模式
这是内置的development production
```js
 /**
     * 'serve': during dev (`vite` command)
     * 'build': when building for production (`vite build` command)
     */
    command: 'build' | 'serve';
```
这意味着当执行 vite build 时，它会自动加载 .env.production 中可能存在的环境变量
```js
# .env.production
VITE_APP_TITLE=My App
```
如果我需要切换测试环境下的接口地址，它应该具有类似于development的行为，但环境变量与开发环境略有不同

--mode 选项标志来覆盖命令使用的默认模式，声明对应的.env.xx文件，这样就可以使用里面的配置了

[模式](https://vitejs.cn/vite3-cn/guide/env-and-mode.html#modes)

但是在 vite.config.ts 中通过 import.meta.env 是无法拿到任何数据

[你可以这样](https://vitejs.cn/vite3-cn/config/#async-config)

注意root 和 envDir 选项会影响加载行为

## envDir
我们现在的.env文件都是建立在根目录的，如果.env.XX的文件太多，会显得我们的项目目录很乱，我们能将.env放在一个统一的文件夹
```js
import { defineConfig } from "vite";
export default defineConfig( {
  envDir:"env"
});
```
放在env这个文件夹即可