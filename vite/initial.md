---
layout: doc
outline: deep
---

## 契机
1. 浏览器支持es模块，之前打包工具打包后的js文件都是放在script标签上进行引入，不能直接使用es模块引入
2. 以编译型语言编写的javascript工具的兴起

随着项目的日渐庞大，基于js的打包工具开始遇到性能瓶颈,文件开发服务器可能需要几分钟才能就绪，即使使用热模块更新（HMR）也需要几秒

## 开发服务器启动缓慢
当冷启动服务器时，传统的打包器必须抓取并构建整个应用程序

vite从依赖，源代码这两部分进行优化

## vite
由两部分组成
1. 开发服务器提供了比原生es模块更强大的功能扩展
2. 一系列使用rollup打包你的代码的命令

vite提供了默认且合理的配置

通过插件，可以支持框架或与其他工具集成

## 功能
### 依赖解析和预捆绑
浏览器不支持裸模块，vite会进行处理

1. 使用esbuild预捆绑依赖，会将其他模块转化为ESM
2. 替换成有效的url进行import

:::tip
依赖被强缓存，如果需要调试依赖，可以在devtool禁用缓存
:::
### HMR
Vite 在原生 ESM 上提供了HMR API。具有 HMR 功能的框架可以利用该 API 提供即时、精确的更新，而无需重新加载页面或清除应用程序状态。不需要手动设置这些,插件已经为你做好了。
### TypeScript
**仅限转译**

转译可以基于每个文件进行，并且与 Vite 的按需编译模型完美契合。相比之下，类型检查需要了解整个模块图。将类型检查强行塞入 Vite 的转换管道将不可避免地损害 Vite 的速度优势。

vite使用esbuild进行转译，比tsc快20到30倍

:::tip
使用类型导入和导出语法可以避免潜在问题
```js
import type { T } from 'only/types'
export type { T }
```
:::

## 依赖预捆绑
`第一次`在项目下执行vite,vite将为依赖执行预捆绑。他是自动且透明的