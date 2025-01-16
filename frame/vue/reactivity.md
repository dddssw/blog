---
outline: deep
layout: doc
---
## 响应式原理
通过proxy拦截一个对象的读取，设置，当读取时将副作用函数存储到桶上，设置时将副作用从桶取出再执行

## 完善的响应式系统
### 提供一个注册副作用函数的函数
```js
01 // 用一个全局变量存储被注册的副作用函数
02 let activeEffect
03 // effect 函数用于注册副作用函数
04 function effect(fn) {
05 // 当调用 effect 注册副作用函数时，将副作用函数 fn 赋值给activeEffect
06 activeEffect = fn
07 // 执行副作用函数
08 fn()
09 }
```
### 桶结构
桶是用来保存被操作字段与对应副作用函数的映射，最外层是weakmap,键名是代理对象target，键值是map，它的键名是target下的key，这个map的键值是一个set，用来保存副作用函数
### 分支切换
可能会产生遗留的副作用函数，解决方法是执行副作用之前，先从与他相关的依赖对应的副作用函数集合去除

当副作用函数执行完毕后，会重新建立联系，但在新的联系中不会包含遗留的副作用函数

也就需要明确知道哪些`依赖集合`中包含它（deps）
```js
01 function track(target, key) {
02 // 没有 activeEffect，直接 return
03 if (!activeEffect) return
04 let depsMap = bucket.get(target)
05 if (!depsMap) {
06 bucket.set(target, (depsMap = new Map()))
07 }
08 let deps = depsMap.get(key)
09 if (!deps) {
10 depsMap.set(key, (deps = new Set()))
11 }
12 // 把当前激活的副作用函数添加到依赖集合 deps 中
13 deps.add(activeEffect)
14 // deps 就是一个与当前副作用函数存在联系的依赖集合
15 // 将其添加到 activeEffect.deps 数组中
16 activeEffect.deps.push(deps) // 新增
17 }
```

而调用副作用函数之前要清除
```js
01 // 用一个全局变量存储被注册的副作用函数
02 let activeEffect
03 function effect(fn) {
04 const effectFn = () => {
05 // 调用 cleanup 函数完成清除工作
06 cleanup(effectFn) // 新增
07 activeEffect = effectFn
08 fn()
09 }
10 effectFn.deps = []
11 effectFn()
12 }
```
clean函数
```js
01 function cleanup(effectFn) {
02 // 遍历 effectFn.deps 数组
03 for (let i = 0; i < effectFn.deps.length; i++) {
04 // deps 是依赖集合
05 const deps = effectFn.deps[i]
06 // 将 effectFn 从依赖集合中移除
07 deps.delete(effectFn)
08 }
09 // 最后需要重置 effectFn.deps 数组
10 effectFn.deps.length = 0
11 }
```
## 嵌套的effect
例如
```js
01 effect(() => {
02 Foo.render()
03 // 嵌套
04 effect(() => {
05 Bar.render()
06 })
07 })
```
所以需要一个effect栈
```js
01 // 用一个全局变量存储当前激活的 effect 函数
02 let activeEffect
03 // effect 栈
04 const effectStack = [] // 新增
05
06 function effect(fn) {
07 const effectFn = () => {
08 cleanup(effectFn)
09 // 当调用 effect 注册副作用函数时，将副作用函数赋值给 activeEffect
10 activeEffect = effectFn
11 // 在调用副作用函数之前将当前副作用函数压入栈中
12 effectStack.push(effectFn) // 新增
13 fn()
14 // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把
activeEffect 还原为之前的值
15 effectStack.pop() // 新增
16 activeEffect = effectStack[effectStack.length - 1] // 新增
17 }
18 // activeEffect.deps 用来存储所有与该副作用函数相关的依赖集合
19 effectFn.deps = []
20 // 执行副作用函数
21 effectFn()
22 }
```
## 调度执行
有能力决定副作用函数执行的时机、次数以及方式

连续多次修改响应式数据但只会触发一次更新

这些任务同步加进去，同步执行完执行微任务
```js
01 // 定义一个任务队列
02 const jobQueue = new Set()
03 // 使用 Promise.resolve() 创建一个 promise 实例，我们用它将一个任务添加到微任务队列
04 const p = Promise.resolve()
05
06 // 一个标志代表是否正在刷新队列
07 let isFlushing = false
08 function flushJob() {
09 // 如果队列正在刷新，则什么都不做
10 if (isFlushing) return
11 // 设置为 true，代表正在刷新
12 isFlushing = true
13 // 在微任务队列中刷新 jobQueue 队列
14 p.then(() => {
15 jobQueue.forEach(job => job())
16 }).finally(() => {
17 // 结束后重置 isFlushing
18 isFlushing = false
19 })
20 }
21
22
23 effect(() => {
24 console.log(obj.foo)
25 }, {
26 scheduler(fn) {
27 // 每次调度时，将副作用函数添加到 jobQueue 队列中
28 jobQueue.add(fn)
29 // 调用 flushJob 刷新队列
30 flushJob()
31 }
32 })
33
34 obj.foo++
35 obj.foo++
```
## 响应式原理
Vue的响应式系统在运行时跟踪属性的访问，它通过结合proxy包装器和getter/setter函数来实现。

proxy第一个参数是被代理对象，第二个参数是一组traps，通过这些traps可以控制被代理对象的基本操作。

对于reactive来说，有get、set、deleteProperty、has、ownKeys这些traps，在get中触发track依赖收集。

在track内部我们会检查当前是否有正在运行的副作用。如果有，我们会查找到一个存储了所有追踪了该属性的订阅者的Set，然后将当前这个副作用作为新订阅者添加到该Set中。

副作用订阅将被存储在一个全局的`WeakMap<target, Map<key, Set<effect>>>`数据结构中。如果在第一次追踪时没有找到对相应属性订阅的副作用集合，它将会在这里新建。

在set中处理新增和修改属性，会触发trigger派发更新。

在trigger内部，我们会再查找到该属性的所有订阅副作用。但这一次我们需要执行它们。

最常见的响应式副作用就是更新dom。每个组件实例创建一个响应式副作用来渲染和更新dom。

而对于ref，返回一个对象，里面有一个响应式属性value，执行getter时，进行track，执行setter时触发trigger，对于setter的参数value则会使用reactive处理。