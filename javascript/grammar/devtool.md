---
outline: deep
layout: doc
---

## console.trace
打印堆栈
## 性能监控
<img src="https://s2.loli.net/2025/01/20/AmJspz2wPyhk7aE.jpg" >

## 陷入死循环，cpu飙升
切换source

<img src="https://s2.loli.net/2025/01/20/GxJAVO5Hb6yzkvd.png" >

手动暂停，查看call stack
```js

import { highlightCode, consoleInfo } from "../utils/printCode";
export const infoData = {
  tableexpose: async () => {
    const list = [
      "getSelectionRows 用于多选表格，返回当前选中的行数据,也可以监听select-change进行赋值",
      "toggleRowSelection 用于多选表格，切换某一行的选中状态，第一个参数是行数据（row），如果使用了第二个参数，则可直接设置这一行选中与否",
      "clearSelection 用于多选表格，清空用户的选择",
    ];
    consoleInfo(list, "el-table expose");
  },
  validTable: async () => {
    const list = [
      "table的源数据作为form :model绑定的一个属性",
      "在需要校验的组件外包裹el-form-item组件",
      `<el-form-item :prop="'tableData.' + index + '.name'" :rules="rules.name">`,
      `这里校验的是:model绑定数据下.tableData[index].name,所以组件也绑定这个值即可`,
      `<el-input v-model="row.name">`,
    ];
    consoleInfo(list, "el-form校验el-table");
  },

  虚拟列表: () => {
    const list = [
      "首先确定一下html结构,最外面 div 就是设定高度的窗口，内部一层的 div 需要计算出总高度，再内部一层的 div 通过 translateY XX 移动到合适的位置",
      "初始时计算总高度和页面展示的子项个数,需要加上缓冲区",
      "滚动过程中计算开始节点(需要减去上缓冲区)和需要展示的子项",
      "对于不定高的,开始需要计算出高度数组和需要展示的子项个数,滚动过程中二分查找计算开始节点,并计算应该展示多少个子节点需要加上缓冲区",
    ];
  },

  "watch/watcheffect": () => {
    const list = [
      "都是用来监听响应式数据的变化，但使用场景不同",
      "watch需要显式指定依赖对象，监听多个数据需要用数组，并能提供新值和旧值",
      "watcheffect能自动收集所有依赖",
      "watch可以配置flush，deep,immediated,watcheffect只有flush，没有deep,immediated相当于是true",
      "如果只需要监听一个对象中的几个属性，使用watcheffect更好，因为它将只跟踪回调中使用到的属性，而不是递归的跟踪所有属性",
    ];
    consoleInfo(list, "watch watcheffect的区别");
  },
  "ref/reactive": () => {
    const list = [
      "都是用来创建响应式数据，但是使用场景有些不同",
      "reactive只能用于复杂数据类型，不能替换整个对象，对解构操作不友好。而ref更为通用，但是使用需要多写一个.value。",
      "并且需要注意ref有自动解包策略",
      "watch对ref reactive数据监听不同，如果是reactive，修改它的任何属性都会触发",
      "对应ref，默认情况下只会对.value的重新分配做出反应，但是可以使用deep让他监听所有的嵌套属性",
      "https://github.com/orgs/vuejs/discussions/9428(playground中有bug未解决)",
    ];
    consoleInfo(list, "ref reactive");
  },
  "watch/computed": () => {
    const list = [
      "watch是监听动作，computed是计算属性",
      "watch没缓存，只要监听的数据变化就执行。computed有缓存，只有响应式数据改变才会重新计算",
      "watch可以执行异步操作，computed不行",
      "watch常用于一个数据影响多个数据，而computer常用于多个数据影响一个数据",
    ];
    consoleInfo(list, "watch/computed 的区别");
  },
  "defineProperty/proxy": () => {
    const list = [
      "使用defineProperty是因为当时proxy兼容性不好",
      "defineProperty只能劫持对象属性的getter和setter，并且无法监听会修改原数组的数组方法，所以对这些方法就行重写",
      "proxy能直接劫持整个对象",
      "可以直接监听对象，数组的变化，并且拦截类型多达13种",
    ];
    consoleInfo(list, "defineProperty/proxy 的区别");
  },
  scoped: () => {
    const list = [
      "scoped会为组件生成唯一标识，并在dom上添加这个属性，选择器也会在末尾加上这个属性选择器",
      "使用scoped无法修改第三方组件库的样式，因为最后选择器会加上这个属性，但是使用样式穿透可以实现修改样式",
      "本质是用了样式穿透后，在deep之后的选择器最后就不会加上这个属性",
      "或者新增一个不带scoped的style，但要注意不要产生全局污染",
    ];
    consoleInfo(list, "scoped");
  },
  js基本数据类型有哪些及它们的区别: () => {
    const list = [
      "js有八种数据类型,分别是null,undefined,number,string,boolean,object,symbol,bigint",
      "symbol和bigint是es6新增的,symbol是为了创建一个独一无二的数据,解决可能出现的全局变量冲突的问题",
      "js的number类型是基于IEEE754标准,最大可以表示的数是2^53-1,超过这个范围精度会丢失,bigint能表示任意大小的数,不会出现精度丢失",
      "这些数据可以分为原始数据类型和引用数据类型",
      "两种类型的区别在于存储位置的不同,原始数据类型放在栈中,引用数据类型放在堆中.但是在栈中会存放指向堆的指针",
    ];
  },
  数据类型检测的方式有哪些: () => {
    const list = [
      "typeof",
      "typeof null 的结果为 object,这是官方承认的 typeof 的错误，这个问题来自于 JavaScript 语言的早期阶段，并为了兼容性而保留了下来。null 绝对不是一个 object。null 有自己的类型，它是一个特殊值。typeof 的行为在这里是错误的。",
      "typeof alert 按理应该是返回 object。但是 typeof 会对函数区分对待，并返回 function。这也是来自于 JavaScript 语言早期的问题。从技术上讲，这种行为是不正确的，但在实际编程中却非常方便。",
      "instanceof,其内部运行机制是判断在其原型链中能否找到该类型的原型,只能正确判断引用数据类型，而不能判断基本数据类型",
    ];
  },
  this: () => {
    const list = [
      "指向当前执行上下文中的 执行环境 或 函数调用的上下文",
      "箭头函数的写法更简洁,箭头函数没有this,继承与外部词法环境,不能被修改,没有arguments,不能成为构造函数",
    ];
  },
  "var,let,const": () => {
    const list = [
      "let const 有块级作用域,var没有",
      "var允许重复声明",
      "使用var声明的全局函数和变量会成为全局对象的属性",
      "var声明会被提升,,但是赋值不会,let const有暂时性死区",
      "const必须设置初始值,const声明之后不能重新赋值",
    ];
  },
  new: () => {
    const list = [
      "创建一个空对象分配给this",
      "执行函数体,通常会修改this",
      "返回this",
    ];
  },
  es6: () => {
    const list = [
      "let const",
      "箭头函数",
      "解构赋值",
      "模版字符串",
      "promise",
      "扩展运算符",
    ];
  },
  promise: () => {
    const codeSnippet = `//ajax改造成promise
      function ajax(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    // 设置请求成功的回调
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText); // 请求成功，返回响应内容
      } else {
        reject(new Error()); // 请求失败
      }
    };

    // 设置请求失败的回调
    xhr.onerror = function() {
      reject(new Error('Network error')); // 网络错误
    };

    // 发送请求
    xhr.send();
  });
}

// 使用 Promise 的方式进行调用
ajax('https://api.example.com/data')
  .then(response => {
    console.log('Success:', response);
  })
  .catch(error => {
    console.log('Error:', error);
  });
`;
    highlightCode(codeSnippet);
  },
  "null/undefined": () => {
    const list = [
      "基本是同义的,只有一些细微的差别,null表示此处不应该有值,undefined表示此处应该有一个值,只是没有定义",
      "所以访问一个不存在的对象属性返回是undefined",
      "在双等检查中返回true,除此之外,它们在双等检查中不会进行隐式转换",
    ];
    consoleInfo(list, "null undefined的区别");
  },

  promise执行顺序console: () => {
    // 第一部分：Promise的执行顺序和说明
    const list1 = [
      `new Promise(resolve => {
      console.log('test');
      resolve();
    });`,
      "new Promise在then之前都是同步的,会立即打印test",
      `new Promise(resolve => {
      resolve();
      console.log('test');
      reject();
    });`,
      `执行了resolve、打印"test"、reject，这3句代码都会执行，但是reject不会生效`,
      "方法：从上往下执行，先执行同步代码，微任务放入一个队列，宏任务放入一个队列，promise.then之前都是同步的",
    ];

    consoleInfo(list1, "promise执行顺序console");

    // 第二部分：第一个Promise示例（复杂的Promise嵌套和微任务）
    const test1 = `
    const first = () => (new Promise((resolve, reject) => {
      console.log(3);
      let p = new Promise((resolve, reject) => {
        console.log(7);
        setTimeout(() => {
          console.log(5);
          resolve();
        }, 0);
        resolve(1);
      });
      resolve(2);
      p.then((arg) => {
        console.log(arg);
      });
    }));
    first().then((arg) => {
      console.log(arg);
    });
    console.log(4);
  `;
    // 预期输出顺序：3, 7, 4, 1, 2, 5
    highlightCode(test1);

    // 第三部分：关于async/await的注意点
    const list2 = [
      "async await,await之前的包括await这行都是同步执行,下面的进入微任务",
      "async修饰的函数,如果不是返回一个promise,则会包装成一个已经fulfilled(resolve)的promise",
      "函数return的是promise这种特殊情况，return意味着外层内容是等到return结果之后才执行的，return未完成，这个then就未完成",
      "所以这个promsie会被加入微任务，但是对于async修饰的函数，并且不是返回promise，默认会被promise包装，这个promise不会进入微任务",
    ];

    consoleInfo(list2, "async await的注意点");

    // 第四部分：async/await 示例代码
    const test2 = `
    async function async1() {
      console.log('async1 start');
      await async2();
      console.log('async1 end');
    }

    async function async2() {
      console.log('async2');
    }

    console.log('script start');
    async1();
    new Promise(function (resolve) {
      console.log('promise1');
      resolve();
    }).then(function () {
      console.log('promise2');
    });
    console.log('script end');
  `;
    // 预期输出顺序：script start、async1 start、async2、promise1、script end、async1 end、promise2
    highlightCode(test2);

    const test3 = `
    async function async1() {
      console.log('async1 start');
      await async2();
      console.log('async1 end');
    }
    async function async2() {
      console.log('async2');
      return new Promise((resolve, reject) => {
        resolve()
      });
    }
    console.log('script start');
    async1();
    new Promise(function (resolve) {
      console.log('promise1');
      resolve();
    }).then(function () {
      console.log('promise2');
    });
    console.log('script end');
  `;
    // 预期输出顺序：script start、async1 start、async2、promise1、script end、promise2、async1 end
    highlightCode(test3);

    const test4 = `
    Promise.resolve().then(() => {
      console.log(0);
      return Promise.resolve(4);
    }).then((res) => {
      console.log(res)
    });

    Promise.resolve().then(() => {
      console.log(1);
    }).then(() => {
      console.log(2);
    }).then(() => {
      console.log(3);
    }).then(() => {
      console.log(5);
    }).then(() => {
      console.log(6);
    });
  `;
    highlightCode(test4);
    // 预期输出顺序：0, 1, 2, 3, 4, 5, 6
    // 备注说明：
    // return意味着外层内容是等到return结果之后才执行的，这个promise默认会执行.then从而加入微任务
    // return Promise.resolve(4)会占据两个微任务
    // 参考文章链接：
    // https://juejin.cn/post/7092396674693201956
    // https://blog.csdn.net/qq_53109172/article/details/138552985
    // https://juejin.cn/post/6945319439772434469#heading-31
  },


};
```