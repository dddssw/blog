---
outline: deep
layout: doc
---
## ref
通过ref注册的响应式数据，有一个访问器属性value，当getter时收集依赖，setter时派发更新

而对于set的value，使用toReactive进行处理，首先判断数据类型是不是object，如果不是原样返回，反之使用reactive使value也变成响应式数据
## reactive
:::tip :rocket:代理
允许我们拦截并重新定义对一个对象的基本操作
:::
基于proxy进行代理，他接受两个参数，第一个参数是被代理对象，第二个参数是一组traps,例如get set,通过这些trap可以控制被代理对象的基本操作


对于reactive来说，有get set deleteProperty has ownKeys这些traps

在get中进行track依赖收集，如果value是一个对象，会递归调用reactive实现深度监听。如果value是一个ref类型，会进行自动解包

在set中处理新增和修改属性，进行trigger派发更新

在deleteProperty处理删除属性，触发trigger

在has拦截in操作符，触发track

在ownKeys拦截forin，触发track

通过配置这些traps可以进一步实现shallowreactive，readonly等api

## computed
使用computed注册的响应式数据使用方法与ref差不多，都要使用.value，实际上computed会返回一个对象，里面有个访问器属性value

初始化会自动执行一遍里面的回调函数，收集依赖，并且还有两个属性dirty和value，dirty初始化是true，代表需要重新执行回调，value则是执行完回调return的值

当computed依赖的响应式数据发生改变，dirty被设置为true，当触发getter时需要重新执行回调，将return的值缓存到value，并把新值返回

如果依赖没有改变，也就是dirty为false，就会直接返回缓存的value

## nextTick
::: tip :rocket:
我们通过js修改dom时 dom树在内存中是同步发生更新的，但是此时的最新状态并不会立即反应到屏幕上 而是要等待浏览器的渲染周期和帧率有关 一般在16.6ms 当渲染完成后 才能在屏幕观测到最新的页面
:::

这跟vue的异步更新队列有关，vue会同步将任务放入任务队列，在微任务promise.then中执行任务队列

因此要获取最新的dom，需要在上面提到的微任务执行完之后再执行

nexttick的原理就是通过promise的链式调用,将nexttick里的回调放在上面的微任务.then里执行




