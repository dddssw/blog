---
outline: deep
layout: doc
---

1. [闭包](closure)
2. 原型  
   对象有一个特殊的隐藏属性 prototype,它要么为 null,要么就是另一个对象的引用,该对象被称为原型",  
   属性 [[Prototype]] 是内部的而且是隐藏的,但是使用特殊的名字 **proto** 可以设置它,  
   当访问一个对象的属性,如果没找到就会到原型里找,原型里又有它的原型,这样一直寻找,就是一条原型链,原型链的终点是 null,
3. 迭代器
   for...of 只能遍历可迭代对象，如果遍历对象,  
   需要实现一个 Symbol.iterator 方法,  
   当 for...of 启动时会调用这个方法，这个方法必须返回一个迭代器，一个有 next 方法的对象,  
   当循环希望获得下一个值，会调用这个 next 方法,  
   next 返回的结果格式必须是 {done: boolean, value: any}，当 done 为 true，代表循环结束

   ```js
   let a = {
     start: 1, // 起始值
     end: 4, // 结束值
     // 实现 Symbol.iterator 方法使得对象可迭代
     [Symbol.iterator]() {
       let current = this.start; // 当前值从 start 开始
       return {
         next: () => {
           if (current <= this.end) {
             // 如果当前值在范围内，返回 {done: false, value: current++}
             return { done: false, value: current++ };
           } else {
             // 否则返回 {done: true}，表示结束
             return { done: true };
           }
         },
       };
     },
   };

   // 使用 for...of 遍历对象
   for (let value of a) {
     console.log(value); // 输出: 1, 2, 3, 4
   }
   ```

4. this 打印结果

```js
var a = 1;
var b = {
  a: 2,
  echo: () => {
    console.log(this.a);
  },
};
b.echo();

//

function a() {
  let b = {
    fn: () => {
      console.log(this.data);
    },
  };
  return b;
}

let c = {
  data: 1,
  a,
};

let d = {
  data: 2,
  a,
};

c.a().fn();
d.a().fn();
```
