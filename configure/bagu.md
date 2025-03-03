---
outline: deep
layout: doc
---
## 事件循环
首先js是单线程语言，使用事件循环的原因是为了避免代码阻塞

由调用栈，任务队列，web Api组成

调用栈用来存储同步任务，按顺序执行函数，任务队列分为 宏任务队列（MacroTask Queue） 和 微任务队列（MicroTask Queue），webapi是浏览器提供的异步 API（如 setTimeout、fetch），处理完成后将回调推入队列。

第一步是同步任务直接进入调用栈执行，遇到异步任务交给 Web APIs 处理。第二步当调用栈为空时，事件循环优先清空微任务队列中的所有任务，第三步是从宏任务队列中取出一个任务（如 setTimeout、DOM 事件）执行，然后回到步骤 2。
```js
console.log("1"); // 同步任务

setTimeout(() => console.log("2"), 0); // 宏任务

Promise.resolve()
  .then(() => console.log("3")) // 微任务
  .then(() => console.log("4")); // 微任务

console.log("5"); // 同步任务

// 输出顺序：1 → 5 → 3 → 4 → 2
```
宏任务：`setTimeout`、`DOM 事件`、`I/O`、`requestAnimationFrame`

微任务：`Promise回调`、`MutationObserver`

## 浏览器搜索url
* 查找缓存
* DNS解析
* https还需要通过TLS协议
* 建立tcp连接
* 发送http请求

处理资源
* 解析html生成dom树
* 遇到css生成cssom树
* 遇到普通js会阻塞html解析，需要下载再执行，加了defer或者async不会阻塞
* 将dom树和cssom树合成渲染树
* 计算布局，交给合成器线程和GPU渲染页面
## tree-shaking
基于静态分析，只适用于esm，因为esm是静态的，在编译时就可以确定导入导出，据此去除未使用的代码
## 性能优化
* 打包，使用webpack-bundle-analyse分析插件打包产物，对比较大的文件进行拆包，目的是保证不要太小或者太大，因为太大稍微修改之后整个文件就过期了，太小的话http请求会多发送，尽可能利用浏览器的缓存策略，使用gzip或者brotile压缩
* 代码上要写成支持tree-shaking的格式
* 图片使用webp格式，进行图片懒加载和组件的懒加载
* 将cpu密集型任务迁移到webworker上,防抖和节流
* 使用proload提高关键资源优先级，支持的话尽可能使用HTTP2，使用cdn,如果有跨域连接可以使用preconnect，它会提前建立连接，当然如果过度使用比较消耗资源，dns-prefetch就是更好的替代品
* 框架上，都支持路由懒加载，react有useMemo,useCallback进行缓存，vue支持组件的懒加载，shallowReactive等api
* 渲染层上，降低cls，例如图片尽可能设置高度。减少重排和重绘,虚拟列表。动画使用transition，Gpu加速
* 大文件切片上传