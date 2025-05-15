---
outline: deep
---

### 实现promise.all/allSettled
* 接收一个可迭代对象
* 传入的数据中可以是普通数据，也可以是Promise对象
* 可迭代对象的promise是并行执行的
* 保持输入数组的顺序和输出数组的顺序一致
* 传入数组中只要有一个reject，立即返回reject
* 所有数据resolve之后返回结果

```js
function myPromiseAll(promises){
  return new Promise((resolve,reject)=>{
    if(!Boolean(promises[Symbol.iterator])){
      return reject(new TypeError (`${typeof promises} is not iterable(cannot read property Symbol(Symbol.iterator)`))
    }
    let res = []
    let completed = 0
    if(promises.length===0){
      return resolve(res)//return ,后面不需要执行
    }
    promises.forEach((item,index)=>{
      Promise.reslove(item).then(value=>{
        res[index] = value
        completed++
        if(completed===promises.length){
          resolve(res)
        }
      }).catch(err=>{
        reject(err)
      })
    })
  })
}
```


```js
function myPromiseAllSettled(promises){
     return new Promise((resolve,reject)=>{
      if(!Boolean(promises[Symbol.iterator])){
        return reject(new TypeError(`${typeof promises} is not iterable(cannot read property Symbol(Symbol.iterator)`))
      }
      let res = []
      let completed = 0
      if(promises.length===0){
        return resolve(res)
      }
      promises.forEach((item,index)=>{
        promise.resolve(item).then(value=>{
          res[index]={status:'fulfilled',value}
        }).catch(reson=>{
          res[index]={status:'rejected',reason}
        }).finally(()=>{
          completed++
          if(completed===promises.length){
            resolve(res)
          }
        })
      })
     })
}
```

```js
function myPromiseAll(promises){
 return new Promise((resolve,reject)=>{
if(!Boolean(promises[Symbol.iterator])){
    throw(new TypeError(`${typeof promises} is not iterator`))
}
let res = []
let count = 0
let total = promises.length
if(total===0){
    resove([])
    return
}
for(let i=0;i<total;i++){
    promise.resolve(promise).then((val)=>{
res[i]=val
count++
if(count===total){
    resolve(res)
}
    }).catch((err)=>{
        reject(err)
    })
}
 })
}
```
### 防抖和节流
```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

function throttle(fn,delay){
  let lastTime = 0
  return function(...args){
    const now = Date.now()
    if(now - lastTime >= delay){
      fn.apply(this,args)
      lastTime = now
    }
  }
}
```

### 深拷贝,数组打平