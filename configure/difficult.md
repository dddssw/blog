---
outline: deep
layout: doc
---

## 内存泄漏
线上的商城打开某个商品会出现页面卡死，页面没有报错，所以可能是出现了内存泄露，我打开devtool 里的performance monitor,有两项数据异常，一个是cpu占用，一个是js堆,

堆大小不断增加直到页面崩溃。我怀疑是出现了死循环。我尝试在本地复现，但是无法复现，我看页面也没有报错，但是同事电脑上有，应该是依赖问题，所以我更新了依赖。最后还是不行，后面发现跟依赖预构建有关

报错信息大概跟el-select组件相关，我在这个组件相关的函数里进行打印，发现会打印100次。这跟vue源码有关。

但是内存泄露的原因出在el-select上，我准备了一个最小复现，运行elementplus源码，在里面所有的watch进行打印，发现有个watch执行了100遍。于是就定位到了，之后提了一个pr

## 大文件切片
首先对文件进行切片，传入一个file对象，使用slice对文件按指定大小进行切割获得切片数组。

针对文件生成唯一标识，使用spark-md5(/spa:rk/)生成hash。考虑到这一步将占用大量资源，阻塞主线程。因此在web worker中进行这个操作

调用初始化上传接口，请求参数是切片数，文件hash。返回taskId

调用切片上传接口，入参切片序号，taskId,请求体里文件切片（formData），返回成功，更新上传进度

但是浏览器限制并发请求的个数，如果使用promise.all一次性的并发请求太多可能导致请求直接失败，使用p-limit帮助我们解决限制并发个数的问题

优化：

秒传，在初始化上传接口中如果后端根据hash发现文件已经存在，则会返回一个特殊的状态码表示该文件已存在

断点上传，调用初始化上传接口，如果没有上传完，返回缺失的切片序号，前端再补充上传缺失的切片即可

暂停上传，axios提供的AbortController取消上传
### 使用切片的原因
* 提高上传稳定性，当网络出现波动这个上传可能失败，通过断点续传，我们不需要重新上传整个文件
* 不管是客户端和服务端的内存消耗都会减少
* 通过小块上传，可以充分利用带宽，提升上传速度
* 可以提供更精确的上传进度反馈

### webworker传递大数据
主线程与webwork传递的数据是复制的，而不是共享，需要经过序列号与反序列化，大部分浏览器使用结构化克隆算法（structured clone algorithm）来实现。

但是可转移对象（ Transferable object）通过零拷贝操作从一个上下文转移到另一个上下文，这在发送大型数据集时可带来巨大的性能提升。

这些资源可以从一个上下文转移到另一个，但是资源一次只能在一个上下文可用
## vscode插件
我开发的时候遇到一个让我感觉麻烦的问题，当我使用一些公用的hook,它导出的东西比较多，我不得不去其他文件里复制再粘贴回来，这种切换上下文的操作让我感到非常不舒服。

我的思路是把公用的hooks和utils放在侧边栏下，点击导出的函数即可自动插入到当前光标的位置，我认为这对于每个项目都是通用的。想实现这个效果我必须借助vscode插件

因为我是从0开始开发的，所以需要走搭建框架，调试，开发，发布到插件市场整个流程，每个部分我都需要研究学习文档并且还需要学习node的部分api。当然报错是必不可少的，所以解决报错也花了很多时间。

完成这个功能我需要获取文件里导出的内容，实现这个功能的技术路线也十分曲折，最终确定使用babel的ast来获取导出内容，并且ast可以增强我们插件的能力，即便如此使用ast解析除导出内容也不是一样容易的是，所以针对这个功能还写了一个npm包

ui方面有两种实现分别是使用treeview或者webview，最终选择使用treeView

除了之外呢想做的更通用，通过vscode setting可以自由配置，例如现在默认所有的hooks是放在src下的hooks文件夹下，通过配置，不是叫hooks也行

还有最后一个优化点，修改导出的内容，插件不会有感知，所以内容还是旧的。我看了其他插件是带了一个refresh的按钮，我也实现了这个功能

并且通过vscodeapi可以实现实时监听不需要手动刷新，对性能也不会造成较大影响。使用zustand做全局状态管理
### ast节点查询优化
* 避免多次遍历，尽量在一次遍历收集全部信息，如果找到了节点，可以提前跳出对其子树的遍历
* 使用babel内置的路径查询api并对查询条件过滤
* 对已解析的文件建立缓存，如果没有修改就没必要重新解析
* 对高频查询节点创建索引
* 使用swc代替babel解析ast

### ast原理
* 首先进行词法分析，将源代码拆分成最小语法单元token,通过有限状态机生成token序列
* 进行语法分析，根据编程语言的语法规则，将Tokens组合成AST,语法分析器会检验代码是否符合语法规范


## 组件库
## 瀑布流组件
性能优化

1. 首先是图片方面,为了降低FCP,LCP
* 首先禁止上传gif格式。图片格式可以转成webp格式，按照华为云obs文档，在url上添加请求参数可以返回webp格式图片，但是这么请求的图片不会被http缓存，并且每请求一次都会重新进行格式转化，成本会大幅上升。所有需要上传的时候就将图片转成webp格式存放在桶里，返回的时候返回webp即可
* 按照屏幕宽度请求合适尺寸的图片，但会回到之前那个问题也就是不会被http缓存，这样虽然可以加速首屏，但是之后每次都需要重新获取。我是通过service worker来解决的。通过拦截指定的图片域名请求，如果没有命中会放入cache中，命中则从cache中取。当然也可以给缓存设置过期时间，类似于强缓存的效果
* 可以使用preconnect提前建立与obs域名的连接，当然如果需要与多个第三方域建立连接，全部preconnect可能会适得其反，可以替换为dns-prefetch
* 我观察到现在的协议是http1.1，可以使用http2解决队头阻塞的问题，当然http2也只是解决了http层的阻塞，tcp层的阻塞没有解决，http3就是为了解决tcp层的队头阻塞问题，他使用的是quic协议，基于utp而非tcp，所有下一代方案是使用http3

2.代码或者框架层面
*  我刚才又提到我自己fetch api拿到图片信息,之前是在for循环了一个一个await拿到,但是可以并发发送请求.因为每个网站都有最大连接数,需要写一个限制最大并发数的函数,并发数我设置的是6.
* 刚才提到我实现了一个懒加载的自定义指令,每个图片里都会new 一个intersectionobserve,我想使用一个单例实现,并且我在mdn看了文档,发现它可以observe某个元素,不需要可以unobserve.证明这是可行的,所以我封装了一个hook用来创建intersectionobserve实例.这样只需要一个实例既可完成监听功能
* 对于resizeObserve,因为他的触发频率会很高,所以使用了节流,并且将回调放在requestAnimationFrame里，还有就是我只关心它的宽度，如果宽度不变，高度改变，不会触发回调，这在初始化的时候高度会变化
* 框架上则是使用computed缓存了一些计算结果,有使用到watch,但是这个watch只是第一次有用,使用了vue一个比较新的配置项once.来实现一次监听即销毁
* 最后在umounted生命周期释放之前那两个web api实例的内存占用

用户体验上

1. ui上的要求是滚动时隐藏搜索条件，使用了vue的内置组件transion实现了v-if的动画。
2. 对于瀑布流组件需要先获取数据才能渲染，为了视觉不会太突兀，这里准备了一个骨架屏

性能指标
整体得分是从93到96，fcp提升12.5%，lcp提升18.75%，speed index提升了27.27%

问题
如果第一页的数据没有铺满屏幕，就会请求两次接口

首先第一次接口拿到数据，然后渲染出来，这个时候intersectionobserve监听到，发送下一次请求，所以我根据第一次接口返回的数据判断是否需要请求下一页（根据total和record.length < pagesize.length）,将这个属性传递给瀑布流组件，是否需要请求下一页

```js
const CACHE_NAME = 'imageCache'
// 安装 Service Worker
self.addEventListener('install', async function () {
  self.skipWaiting()
  await caches.open(CACHE_NAME)
})

// FETCH 事件：拦截资源请求
self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url)

  // 判断域名是否为目标域名
  if (url.hostname === 'osstoobs20210306.obs.cn-south-1.myhuaweicloud.com') {
    if (url.searchParams.has('x-image-process')) {
      // 拦截该请求
      event.respondWith(cacheFirst(event.request))
    }
  }
})
const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request)
  //console.log(responseFromCache, 'responseFromCache')
  if (responseFromCache) {
    return responseFromCache
  }
  const responseFromNetwork = await fetch(request)
  await putInCache(request, responseFromNetwork.clone())
  return responseFromNetwork
}
const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME)
  await cache.put(request, response)
}
```
## vite环境变量
标准化package.json脚本命令，为不同环境注入环境变量，并通过环境变量进行动态代理配置，极大减少了切换环境的重复操作并保留其灵活性（注释）
```js
    "dev": "vite --host --mode dev",
    "qa": "vite --host --mode qa",
    "uat": "vite --host --mode uat",
    "prod": "vite --host --mode prod",
    "build-dev": "vite build --mode dev",
    "build-qa": "vite build --mode qa",
    "build-uat": "vite build --mode uat",
    "build": "vite build --mode prod",
    "postbuild": "node ./build/build.js",
```
## 测试环境下打包后自动刷新页面，切换路由时触发，并改造成vite插件
每次build之后生成一个version.json文件，里面存放创建时的时间戳，当获取远程的文件里的时间戳与本地存放的时间戳不一致时重新刷新页面

刚开始这是一个js文件，在build之后的钩子里执行会生成version文件，但是script脚本中我们有不同环境的build命令，这样写太累赘。所以改成了一个插件，并且根据mode激活或停用该插件（falsy值）
```js
import fs from 'fs'
import path from 'path'

export default function versionPlugin() {
  return {
    name: 'geCai-plugin-version', 

    // 在 Vite 构建结束后执行
    closeBundle() {
      console.log('build > 文件开始执行！')

      try {
        const OUTPUT_DIR = 'dist'
        const VERSION = 'version.json'

        // 生成随机版本号
        const versionJson = {
          version: 'V_' + Math.floor(Math.random() * 10000) + Date.now()
        }

        // 写入 version.json 文件
        const versionFilePath = path.resolve(process.cwd(), OUTPUT_DIR, VERSION)
        fs.writeFileSync(versionFilePath, JSON.stringify(versionJson))
        console.log(`version file is built successfully at ${versionFilePath}`)
      } catch (error) {
        console.error('version build error:\n' + error)
        process.exit(1)
      }

      console.log('build > 文件执行结束！')
    }
  }
}

```
## vite打包优化 
vite build速度优化，大约提升60%
* 性能瓶颈主要是降级插件导致的，所以只在生产坏境开启降级插件，减少开发环境下的等待时间([备忘录](#1))
* 禁用生成gzip压缩报告，不生成sourcemap
* vite使用esbuild进行构建，也在同步研发rolldown来进一步提升速度

vite构建产物优化
* 图片上传到oss，并接入cdn。小图片转成内联的base64
* 代码分割,尽可能利用http缓存.也可以在打包时排除一些依赖,将其放到cnd上
* 支持tree-shaking的写法
```js
  rollupOptions: {
        output: {
          entryFileNames: 'js/[name].[hash].js',
          assetFileNames: '[ext]/[name].[hash].[ext]',
          // 拆分js到模块文件夹
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/')
              : []
            const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]'
            return `js/${fileName}/[name].[hash].js`
          },
          manualChunks: (id) => {
            console.log(id)//路径
            if (id.includes('node_modules')) {
              // 独立分包核心库（如 Vue、React）
              if (id.includes('vue')) return 'vendor-vue'
              if (id.includes('element-plus')) return 'elementPlus'
              // 按包名拆分第三方库
              const libName = id.split('node_modules/')[1].split('/')[0]
              return `vendor-${libName}`
            }
            // 业务代码按功能模块拆分
            if (id.includes('src/features/')) {
              return 'feature-modules'
            }
          }
        }
      }
```
[参考](https://vite.dev/config/)


### 备忘录{#1}
降级是必须的,所以这方面看起来没有优化的空间.但是换一个角度来看,我只需要在prod环境使用这个插件,dev,qa这种环境根本不需要.而我们最常接触的是dev,qa环境

并且得益于我之前的一个改动,就是为每个环境设置了.env文件,并让运维修改之前统一的打包命令npm run build,改成npm run build-dev/qa

所以我可以根据环境来判断是否需要启用插件


