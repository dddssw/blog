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

## 组件库

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


