---
outline: deep
---

## 原因
* 提高上传稳定性，当网络出现波动这个上传可能失败，通过断点续传，我们不需要重新上传整个文件
* 不管是客户端和服务端的内存消耗都会减少
* 通过小块上传，可以充分利用带宽，提升上传速度
* 可以提供更精确的上传进度反馈

首先对文件进行切片，传入一个file对象，file对象继承了blob(/blab/)的slice（/slais/）方法,使用它对文件按指定大小进行切割获得blob切片数组。
```js
const createFileChunk = (file: UploadRawFile, size = CHUNKSIZE) => {
  const fileChunkList = []
  let cur = 0
  while (cur < file.size) {
    fileChunkList.push({
      file: file.slice(cur, cur + size)
    })
    cur += size
  }
  return fileChunkList
}
```
针对文件生成唯一标识，使用spark-md5(/spa:rk/)生成hash。考虑到这一步将占用大量资源，阻塞主线程。因此在web worker中进行这个操作

调用初始化上传接口，请求参数是切片数，文件hash。返回taskId

调用切片上传接口，入参切片序号，taskId,请求体里文件切片（formData），返回成功，更新上传进度

但是浏览器限制并发请求的个数，如果使用promise.all一次性的并发请求太多可能导致请求直接失败，使用p-limit帮助我们解决限制并发个数的问题

优化：

秒传，在初始化上传接口中如果后端根据hash发现文件已经存在，则会返回一个特殊的状态码表示该文件已存在

断点上传，调用初始化上传接口，如果没有上传完，返回缺失的切片序号，前端再补充上传缺失的切片即可

暂停上传，axios提供的AbortController取消上传

```
const controller = new AbortController();

axios.get('/foo/bar', {
   signal: controller.signal
}).then(function(response) {
   //...
});
// 取消请求
controller.abort()
```

恢复上传，已知已上传成功列表，只需要上传除此之外的切片

## webworker传递大数据
主线程与webwork传递的数据是复制的，而不是共享，需要经过序列号与反序列化，大部分浏览器使用结构化克隆算法（structured clone algorithm）来实现。

但是可转移对象（ Transferable object）通过零拷贝操作从一个上下文转移到另一个上下文，这在发送大型数据集时可带来巨大的性能提升。

这些资源可以从一个上下文转移到另一个，但是资源一次只能在一个上下文可用
