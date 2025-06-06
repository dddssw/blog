---
outline: deep
layout: doc
---

## computed
使用computed会返回一个对象，它也有一个访问器属性value.

并且还有两个属性dirty和value，dirty初始化设置为true，代表需要重新执行回调，value则是回调return的值。

当computed依赖的响应式数据发生变化，dirty被设置为true，当触发getter时会重新执行回调，并更新value，将新值返回。

如果依赖没有改变，触发getter不会重新执行回调，而是返回缓存的value。
## nextTick
::: tip :rocket:
我们通过js修改dom时 dom树在内存中是同步发生更新的，但是此时的最新状态并不会立即反应到屏幕上 而是要等待浏览器的渲染周期和帧率有关 一般在16.6ms 当渲染完成后 才能在屏幕观测到最新的页面
:::

这跟vue的异步更新队列有关，vue会同步将任务放入任务队列，在微任务promise.then中执行任务队列

因此要获取最新的dom，需要在上面提到的微任务执行完之后再执行

nexttick的原理就是通过promise的链式调用,将nexttick里的回调放在上面的微任务.then里执行
## watch
基于vue响应式系统，首先会将watch的第一个参数标准化，也就是getter函数的形式，将其创建为一个响应式副作用，配合调度器控制watch回调的执行。

当响应式数据发生改变，触发trigger派发更新，由于调度器的存在，会再次执行watch里的回调，也会执行上面的getter函数拿到新值，旧值通过闭包拿到，最后将新旧值做为回调的参数。

通过源码可以发现，watch监听ref reactive数据类型是不同的，当是reactive类型，默认会调用traverse进行深度监听，对于ref类型，不会进行深度监听，通过设置deep：true能实现深度监听。

对于flush，这跟组件的更新时机有关系，默认是pre，也就是在父组件更新之后，子组件更新之前执行，post是在组件更新之后，sync则是同步执行。

watchEffect则是vue提供的创建响应式副作用的api。
## keepalive
卸载时并不会真的卸载，而是移动到一个隐藏容器里，挂载时也不是真的挂载，而是从隐藏容器中取出放在页面上

keepalive有一个特殊标识表明他是缓存组件,keepalive通过ctx实现与渲染器的通信，keepalive会在ctx上实现activate/deactivate

缓存策略类似于 LRU 缓存，也就是最久没有被使用的先销毁

## vite为什么比webpack快
浏览器开始原生支持 ES 模块，且越来越多 JavaScript 工具使用编译型语言编写  

更快的开发服务器启动  

当冷启动开发服务器时，基于打包器的方式启动必须抓取并构建整个应用。然后才能提供服务

vite把模块分为依赖和源码两部分

首次启动vite，使用esbuild进行预构建依赖，默认情况下，它是自动且透明地完成的，esbuild使用go写的，速度比基于js的工具更快

vite以原生esm提供源码，这实际上是让浏览器接管了部分打包工作，vite只需要在浏览器请求源码时进行转换并按需提供源码

## 依赖预构建: 
利用esbuild将依赖全转成esm

为了提高后续页面的加载性能，Vite 将那些具有许多内部模块的 ESM 依赖项转换为单个模块

对于有多个内置模块的依赖，大量请求会导致浏览器端的网络拥塞，使页面加载变得明显缓慢

将这样的依赖预构建成单个模块，就只需要一个http请求

## 热更新









