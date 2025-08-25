---
outline: deep
---
需要https

您的服务工作者将观察以下生命周期：

* 下载
* 安装
* 激活

如果这是首次启用 service worker，页面会首先尝试安装，安装成功后它会被激活。

如果现有 service worker 已启用，新版本会在后台安装，但仍不会被激活——这个时序称为 worker in waiting

这是一个基本示例
::: code-group
```js [public/sw.js]
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
  if (responseFromCache) {
    return responseFromCache
  }
  const responseFromNetwork = await fetch(request)
  event.waitUntil(putInCache(request, responseFromNetwork.clone()));//请求和响应流只能读取一次。为了将响应返回到浏览器并将其放入缓存中，我们必须对其进行克隆
  //waitUntil以确保再填充前 Service work 不会被终止
  return responseFromNetwork
}
const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME)
  await cache.put(request, response)
}

```
```js [main.js]
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(() => {
      console.log('Service Worker 注册成功')
      navigator.serviceWorker.register('/sw.js')
    })
    .catch((err) => {
      console.log('Service Worker 注册失败: ', err)
    })
}
```
:::

### install
当获取新的service worker时触发

### activate
当获取新的service worker时触发

标准操作是在触发该事件时准备好您的服务工作者以供使用，例如通过使用内置存储 API 创建缓存，并将您想要离线运行应用程序的资产放置在其中

触发此事件的时间点通常是清理旧缓存以及与 Service Worker 先前版本相关的其他内容的好时机。
### fetch
fetch 事件对象包含一个 request 属性，其中包含一些有用的信息，可帮助您识别每个请求的类型：
* url，即 fetch 事件当前正在处理的网络请求的 URL。
* method，即请求方法（例如 GET 或 POST）。
* mode，用于描述请求的模式。“navigate”值通常用于区分 HTML 文档请求和其他请求。
* destination，用于描述所请求内容的类型，以避免使用所请求资源的文件扩展名。
### Cache
Service Worker 技术中不可或缺的一部分是 Cache 接口，它是一个完全独立于 HTTP 缓存的缓存机制。Cache 接口可以在 Service Worker 作用域内以及主线程作用域内访问。

[Cache](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache)

Cache接口为缓存的Request/Response对象提供存储机制,它允许我们存储由响应传递的资源，并以响应的请求为键,键值键名不能是其他类型，否则什么都不会发生

### CacheStorage
相当于Cache的集合，通过caches.open创建一个缓存空间

### 更新新版本时，激活这个生命周期很重要
一旦旧版服务工作线程控制的所有页面都关闭，就可以安全地停用旧版本服务工作线程，新安装的服务工作线程会收到一个activate事件.activate的主要用途是清理旧版服务工作线程使用的资源

新的服务工作线程可以调用skipWaiting()请求立即激活，而无需等待打开的页面关闭。

Service Worker 激活后会控制页面，但默认情况下，它只会控制那些在 register() 成功之后打开的页面。换句话说，已经打开的页面（在 Service Worker 注册成功之前打开的页面）不会立刻被新的 Service Worker 控制，除非这些页面被重新加载

lients.claim() 方法可以改变这一行为，允许新的 Service Worker 立即控制所有的页面，甚至是那些在 Service Worker 激活之前已经打开的页面。它会在 activate 事件中调用，从而使得 Service Worker 在激活时接管所有符合作用域的页面，而不需要这些页面重新加载

```js
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
```
### skipWaiting/Clients.claim
skipWaiting() 方法强制等待的service work成为活跃的service work。
```js
//一般在install执行
self.addEventListener("install", (event) => {
  self.skipWaiting();
});
```
将此方法与 Clients.claim() 一起使用，以确保对底层服务工作者的更新对当前客户端和所有其他活动客户端立即生效。

总结：skipWaiting()用于需快速激活新 Worker 但允许页面延迟控制，clients.claim()在此基础上立即接管旧 Worker 控制的页面
### waitUntil()
waitUntil() 接受一个返回 Promise 的参数，只有当这个 Promise 完成（无论是成功或失败）时，事件才会被认为是完成的。
1. 在 install 事件中的作用
* 在 install 阶段，waitUntil() 被用来确保 Service Worker 在完成重要的任务之前不会被认为已经安装完成。例如，你可能需要将一些必要的资源缓存到浏览器中。在这段时间里，Service Worker 会等待这些任务（例如缓存操作）完成后才会继续。
* 如果传递给 waitUntil() 的 Promise 被拒绝（即任务失败），安装过程会被视为失败，当前的安装中的 Service Worker 会被丢弃。
* 用途：确保 Service Worker 安装完成之前，所依赖的资源（如缓存）已经成功加载，避免 Service Worker 在资源尚未准备好的情况下被激活。
2. 在 activate 事件中的作用
* 在 activate 阶段，waitUntil() 让 Service Worker 有时间进行一些必要的后续操作。例如，你可能需要删除过时的缓存或更新数据库模式。
* waitUntil() 确保这些任务（比如删除旧缓存）完成后，才会继续进行其他事件（比如处理 fetch 或 push 事件）。这让你可以确保 Service Worker 已经完全升级并处于正确的状态，避免未更新的资源影响后续的请求。

## 删除旧缓存
```js
const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = ["v2"];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});

```
waitUntil() 确保你传递的异步操作（比如清理缓存）在新的 Service Worker 开始处理 fetch 事件之前完成，避免发生未完成清理的情况，保证数据一致性和应用的稳定性。

## 加上缓存时间
在上面示例的基础上设置缓存时间
```js
const CACHE_NAME = 'imageCache'
const CACHE_TiME = 'time'
const CACHE_TTL = 365 * 24 * 60 * 60 * 1000
// 安装 Service Worker
self.addEventListener('install', async function () {
  self.skipWaiting()
  await caches.open(CACHE_NAME)
  await caches.open(CACHE_TiME)
})
self.addEventListener('activate', (event) => {
  event.waitUntil(deleteOldCaches())
  console.log('clearALL')
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
  const cache = await caches.open(CACHE_NAME)
  const times = await caches.open(CACHE_TiME)
  const responseFromCache = await cache.match(request)
  const time = await times.match(request)
  let isExpire = false
  if (time) {
    const fullText = await new Response(time.body).text()
    console.log(Date.now() - JSON.parse(fullText).timeStamp)
    //是否过期
    isExpire = Date.now() - JSON.parse(fullText).timeStamp > CACHE_TTL
  }
  if (responseFromCache && !isExpire) {
    return responseFromCache
  }
  const responseFromNetwork = await fetch(request)
  await putInCache(request, responseFromNetwork.clone())
  return responseFromNetwork
}
const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME)
  const times = await caches.open(CACHE_TiME)
  await cache.put(request, response)
  await times.put(request, new Response(JSON.stringify({ timeStamp: Date.now() })))
}

const deleteCache = async (key) => {
  await caches.delete(key)
}

const deleteOldCaches = async () => {
  await self.clients.claim()
  const keyList = await caches.keys()
  await Promise.all(keyList.map(deleteCache))
}
```
## 导航预加载
启用后，导航预加载功能会在发出获取请求后立即开始下载资源，并与 Service Worker 激活同步。这确保了导航到页面后立即开始下载，而不必等到 Service Worker 激活。这种延迟相对较少发生，但一旦发生，则不可避免，并且可能影响很大。

crossorigin="anonymous"
在 Service Worker 的 activate 事件中，你需要调用 navigationPreload.enable() 来启用导航预加载功能：

```js
self.addEventListener("activate", (event) => {
  event.waitUntil(self.registration?.navigationPreload.enable());
});
```
然后使用 event.preloadResponse 在 fetch 事件处理程序中等待预加载资源下载完成。
```js{5}
self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,//拿到预加载的数据
      fallbackUrl: "/gallery/myLittleVader.jpg",
      event,
    }),
  );
});
```
新的流程如下：

1. 检查缓存
2. 等待 event.preloadResponse，它会作为 preloadResponsePromise 传递给 cacheFirst() 函数。如果返回，则缓存结果。
3. 如果以上两个为空，则进行网络请求。
```js
const cacheFirst = async ({
  request,
  preloadResponsePromise,
  fallbackUrl,
  event,
}) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use (and cache) the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info("using preload response", preloadResponse);
    event.waitUntil(putInCache(request, preloadResponse.clone()));
    return preloadResponse;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    event.waitUntil(putInCache(request, responseFromNetwork.clone()));
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};
```
## 深入
Service Worker 是专门的 JavaScript 资源，充当 Web 浏览器和 Web 服务器之间的代理。它们旨在通过提供离线访问来提高可靠性，并提升页面性能。

Service Worker 是对现有网站的增强。这意味着，即使用户使用不支持 Service Worker 的浏览器访问使用了 Service Worker 的网站，也不会影响任何基础功能。

### 离线访问
1. 您首先向网络发出请求，然后将响应放在缓存中。
2. 如果您稍后离线，您将恢复到缓存中该响应的最新版本。
```js
// Establish a cache name
const cacheName = 'MyFancyCacheName_v1';

self.addEventListener('fetch', (event) => {
  // Check if this is a navigation request
  if (event.request.mode === 'navigate') {
    // Open the cache
    event.respondWith(caches.open(cacheName).then((cache) => {
      // Go to the network first
      return fetch(event.request.url).then((fetchedResponse) => {
        cache.put(event.request, fetchedResponse.clone());

        return fetchedResponse;
      }).catch(() => {
        // If the network is unavailable, get
        return cache.match(event.request.url);
      });
    }));
  } else {
    return;
  }
});
```

### 调试
[如何调试 service work](https://web.dev/articles/service-worker-lifecycle#devtools)
[导航预加载](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#service_worker_navigation_preload)

[mdn](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)

[基本架构/流程](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#basic_architecture)

[主动向客户端推送](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

[恢复失败的请求](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#recovering_failed_requests)