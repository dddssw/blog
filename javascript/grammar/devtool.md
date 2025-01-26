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
  debounce: () => {
    const codeSnippet = `
function debounce(func, duration) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(()=>{func.apply(this, args)}, duration);
  };
}
`;
    highlightCode(codeSnippet);
  },
  throttle: () => {
    const codeSnippet = `
function throttle(func, duration) {
  let wait = false;

  return function (...args) {
    if(!wait){
      wait = true
      func.apply(this,args)
      setTimeout(()=>{wait = false},duration)
    }
  };
}
`;
    highlightCode(codeSnippet);
  },
  难点: () => {
    const list = [
      "ui有一个要求,希望我们的搜索结果里把搜索词高亮显示.",
      "开始我们找到一个支持vue3的包来进行高亮显示,但是对于组件库里的组件实现高亮这个包就无能为力了,为此不得不使用原生dom设置innerhtml",
      "这样一来场景不同,实现高亮的方法也不同,而且原生操作很麻烦,第三方库使用起来也有点麻烦.",
      "所以为了统一高亮的实现方案,我花了一些时间研究,发现web api有相关的高亮方法.",
      "在项目中实验可行,因为我们有三个项目都需要统一规范,所以使用 Webpack 打包成一个 npm 包，方便团队共享，并且未来在其他项目中也能复用",
    ];
    const list1 = [
      "前后端联调时间短:之前我们的联调时间比较充裕,这个问题没有暴露出来.",
      "但是这个项目开始是跨科室协作的,而且前期工作量大.导致排期的时候联调时间是被大大压缩的",
      "我们前端主要就是拿到后端给的数据渲染页面,先让我们的页面展示出来,也方便我们完善ui.",
      "所以我就想到了mock数据,接口定好协议我们前端的工作就可以很顺利的展开了",
      "选型上可以使用第三方平台或者我们的文档就是用yapi,它也支持mock数据的功能",
    ];
    const list2 = [
      "大文件上传",
      "通过上传组件我们可以拿到一个file文件,它继承blob,blob提供了一个slice方法,使用这个方法将大文件切片",
      "接下来为文件生成hash,为了防止阻塞,放在了web worker里执行,使用spark-md5以增量方式生成hash",
      "将hash和文件",
    ];
    const list3 = [
      "发现有一些可以公用的方法每个人都单独实现了，造成了项目体积无意义的膨胀。分析了几个原因",
      "其他人压根不知道已经有实现这个功能的方法",
      "有学习成本，需要看别人的代码了解怎么实现",
      "因此需要通用集中管理hook和utils，最好直接展示在vscode侧边栏里，所以想到开发一个插件",
      "首先需要拿到一个文件导出的内容，开始想直接使用import，webpack打包忽略这个import语句，并且使用tsc编译ts文件，但是实际上是不支持",
      "也考虑使用正则，但是太过繁琐，因为导出语法有几种。而且不是很踏实",
      "最后发现使用babel解析出ast，然后在分析这个树，可以获得导出的内容",
      "然后根据获取到的数据在插件中递归渲染一个树视图，得益于ast额外提供的注释节点，位置信息",
      "鼠标悬浮即可显示注释，点击可以跳转文件并自动滚动到导出内容并高亮,点击操作按钮在当前活跃文件上自动导入",
    ];
    const list4 = [
      "解决路由表路由子信息meta数据冗余问题，有的时候新增一个路由，只是从别的位置简单的复制粘贴",
      "导致meta出现一些无意义的数据，而且了解这些meta属性是需要一定时间的",
      "从更长远的角度来看,如果一段时间转向react,在转回vue,vuerouter里这些路由配置是否还记得是什么意思呢",
      "在此基础上，创建完路由还需要创建页面",
      "所以使用脚手架来解决这个问题，基本思路是解析路由表，选择节点位置插入新路由，配置路由表，里面会有相关属性的描述。",
      "自动更新路由表，选择模板文件并生成，生成文件是抽离注册成另一个命令",
    ];
    const list5 = [
      //  "还有一个问题当使用组件库时,需要查找对应组件文档,这就造成了工作流上下文频繁切换的问题,而有时我们只是需要简单的模版",
      //  "我的思路是使用脚手架生成组件模版,里面配置一些常见的属性,当然不仅仅是模版,还有响应式数据,函数的,",
      //  "配合vscode插件将这些部分分别插入template,script.这也解决了vue文件需要滚动在固定区块写代码",
      //  "比较复杂的是el-form,因为elformitem里需要包含其他组件,所以注册组件应该是可复用的."
      "开发过程中发现经常要用组件库的组件,然后去对应的组件文档里复制粘贴过来,而且可能分别需要添加在template和script中",
      "而且还有一些自定义的情况,例如有一个指令禁止输入全角字符,但是我又不记得是怎么写的,我想要用的时候不得不去其他地方找",
      "如果我能通过一些交互生成模版,响应式数据声明,函数.再利用vscode插件提供的接口在当前活跃文件内全部注入",
      "并且需要考虑复用性,可扩展性,使用策略模式避免大量的ifelse,例如怎么生成el-form,因为el-form-item下可以复用生成其他组件的逻辑",
      "对于组件属性配置,我给出了常用的配置,以及自定义的属性例如指令,并添加描述,对于值是非string需要在属性前加上v-bind的简写",
      "除此之外,我还使用了chalk让整个交互具备层次感.",
    ];
  },
  虚拟列表: () => {
    const list = [
      "首先确定一下html结构,最外面 div 就是设定高度的窗口，内部一层的 div 需要计算出总高度，再内部一层的 div 通过 translateY XX 移动到合适的位置",
      "初始时计算总高度和页面展示的子项个数,需要加上缓冲区",
      "滚动过程中计算开始节点(需要减去上缓冲区)和需要展示的子项",
      "对于不定高的,开始需要计算出高度数组和需要展示的子项个数,滚动过程中二分查找计算开始节点,并计算应该展示多少个子节点需要加上缓冲区",
    ];
  },
  "vue2/vue3": () => {
    const list = [
      "重构了响应式系统，性能优化，和Api的改进",
      "vue3使用了基于proxy的响应式系统，支持深度响应式和动态属性的监听",
      "引入了Composition api,使逻辑复用更加方便",
      "新增了fragment，teleport,suspense这样的内置组件",
      "使用ts进行重写，在idea中的代码提示效果更好",
      "在性能方面，优化了模板编译和diff算法，并且支持树摇，打包体积进一步缩小",
    ];
    consoleInfo(list, "vue2与vue3的不同");
    const list1 = [
      "Vue2的响应式原理是基于Object.defineProperty,通过把data返回的对象作为target",
      "这样不管是简单数据类型还是复杂数据类型，都可以通过这个api监听getter和setter",
      "但是它只能监听指定对象的指定属性，所以对于复杂数据类型需要递归监听",
      "当给响应式数据动态新增数据，会出现响应式丢失的问题，因此Vue2提供了一个$set",
      "并且当时proxy的兼容性不好",
    ];
    consoleInfo(list1, "响应式原理的不同");
  },
  vue的响应式原理: () => {
    const list = [
      "主要通过两个api reactive和ref",
      "对于ref注册的响应式数据，他有一个访问器属性value，getter时收集依赖，setter时派发更新",
      "对于setter中的value，使用toReactive进行处理，首先判断value是不是Object，如果不是直接返回，否则会调用reactive使value变成响应式数据",
      "而reactive基于proxy，它接受两个参数，第一个参数是原始对象，第二个参数是一组traps,对于reative里面包含get set deleteProperty has ownKeys这些traps",
      "在get中进行track依赖收集，如果value是个Object，会递归调用reactive实现深度监听，如果是个ref类型，会进行自动解包",
      "在set中处理新增和修改属性，进行trigger派发更新",
      "在deleteProperty处理删除属性，触发trigger",
      "在has拦截in操作符，触发track",
      "在ownKeys拦截forin,触发track",
      "通过配置这些traps可以进一步实现shallowReactive和readonly",
    ];
    consoleInfo(list, "vue的响应式原理");
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
  data: () => {
    const list = [
      "data是一个组件的状态，如果他是一个对象",
      "这个组件被多次引用，那么data将指向同一个地址，但是我们不需要状态共享",
      "所以通过函数返回一个新对象，把状态隔离",
    ];
    consoleInfo(list, "为什么data是一个函数");
  },
  cli: () => {
    const list = [
      "为了降低在项目寻找最佳实践的成本，用于代码生成和自动化,遵循了模块化，便于扩展的原则",
      "例如为input写了一个指令，于是我不得不前往其他文件里查找复制粘贴进来",
    ];
    consoleInfo(list, "背景");
    const list1 = [
      "新增模块需要在路由表进行注册然后新建文件，通过脚手架命令把这个步骤自动化",
      "首先使用babel/parse路由表进行分析，解析出它的层级关系，在通过inquery的交互功能选择在哪个节点上进行新增",
      "确定完位置后对路由表信息进行配置，根据bable/types生成ast节点，将新的ast解析成js代码。这样路由表也就自动更新了",
      "配置之后会询问是否生成模板代码，查找模板自动生成文件",
    ];
    consoleInfo(list1, "难点");
    const list2 = [
      "生成element组件模板代码，但是form表单比较特殊。因为el-form-item会包含其他组件",
      "所以我需要开启另一个进程，并与主进程共享输入输出，但是这样父子进程之间无法通信",
      "想了一些办法来解决，我导出一个对象，在子进程修改对象的键值，等待子进程执行完。再在主进程读取这个对象。",
      "但是发现拿到的对象还是初始值。所以换了一种方式，把对象换成了直接输出文件，在进行读取。这样就可以拿到了",
    ];
    consoleInfo(list2, "难点");
  },
  优化: () => {
    const list = [
      "图片使用webp格式，进行图片/组件的懒加载,将第三方库上传到cdn",
      "通过树摇删除无用代码，使用gzip压缩，合理控制打包文件大小，充分利用浏览器缓存策略",
      "将长任务移动到web worker，防止阻塞页面",
      "防抖和节流，避免内存泄露",
      "使用虚拟列表，大文件上传技术",
    ];
    consoleInfo(list, "性能优化");
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
  原型: () => {
    const list = [
      "对象有一个特殊的隐藏属性prototype,它要么为null,要么就是另一个对象的引用,该对象被称为原型",
      "属性 [[Prototype]] 是内部的而且是隐藏的,但是使用特殊的名字 __proto__ 可以设置它",
      "当访问一个对象的属性,如果没找到就会到原型里找,原型里又有它的原型,这样一直寻找,就是一条原型链,原型链的终点是null",
    ];
  },
  闭包: () => {
    const list = [
      "闭包 是指一个函数可以记住其外部变量并可以访问这些变量",
      "例如防抖节流函数",
      "注意内存泄漏",
    ];
  },
  内存泄漏: () => {
    const list = ["意外的全局变量", "闭包", "定时器", "没有清理的dom引用"];
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
  key: () => {
    const list = [
      "key作为vue的diff算法提示,在比较新旧节点列表时用于识别vnode",
      "",
      "",
    ];
  },
  "ref/reactive实现原理区别": () => {
    const list = ["", "", ""];
  },
  "get/post": () => {
    const list = [
      "get请求的请求参数会放在url之后，参数之间使用&符号连接。post则是放在请求体里",
      "并且浏览器对url的长度是有限制的",
      "post因为请求参数放在请求体里相对安全一点",
      "get会被缓存，post不会，除非响应头包含适当的cache-control或expires",
    ];
    consoleInfo(list, "get/post的区别");
  },
  vite为什么比webpack快: () => {
    const list = [
      "浏览器开始原生支持 ES 模块，且越来越多 JavaScript 工具使用编译型语言编写。",
      "更快的开发服务器启动",
      "当冷启动开发服务器时，基于打包器的方式启动必须抓取并构建整个应用。然后才能提供服务",
      "vite把模块分为依赖和源码两部分",
      "首次启动vite，使用esbuild进行预构建依赖，默认情况下，它是自动且透明地完成的，esbuild使用go写的，速度比基于js的工具更快",
      "vite以原生esm提供源码，这实际上是让浏览器接管了部分打包工作，vite只需要在浏览器请求源码时进行转换并按需提供源码",
      "更快的热更新",
      "在 Vite 中，HMR 是在原生 ESM 上执行的。当编辑一个文件时，Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失活，使得无论应用大小如何，HMR 始终能保持快速更新。",
      "而对于整个页面的刷新，利用http请求头加速整个页面重新加载，源码请求会进行协商缓存，依赖请求会进行强缓存",
    ];
    consoleInfo(list, "vite为什么比webpack快");
  },
  热更新: () => {
    const list = [
      "通过websocket实现浏览器与服务器的通信，当文件修改之后，通知浏览器修改相应代码",
    ];
    consoleInfo(list, "热更新");
  },
  依赖预构建: () => {
    const list = [
      "利用esbuild将依赖全转成esm",
      "为了提高后续页面的加载性能，Vite 将那些具有许多内部模块的 ESM 依赖项转换为单个模块",
      "对于有多个内置模块的依赖，大量请求会导致浏览器端的网络拥塞，使页面加载变得明显缓慢",
      "将这样的依赖预构建成单个模块，就只需要一个http请求",
    ];
    consoleInfo(list, "依赖预构建");
  },
  "为何不用 ESBuild 打包": () => {
    const list = [
      "vite目前的插件api不兼容esbuild,rollup提供了更好的权衡在性能与拓展性方面",
      "并且rollup也在着手改进性能",
    ];
    consoleInfo(list, "为何不用 ESBuild 打包");
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
  this打印结果: () => {
    const test1 = `
    var a = 1;
    var b = {
        a: 2,
        echo: () => {
            console.log(this.a);
        }
    };
    b.echo();
    `;
    highlightCode(test1);

    const test2 = `
    function a() {
        let b = {
            fn: () => {
                console.log(this.data);
            }
        };
        return b;
    }

    let c = {
        data: 1,
        a
    };

    let d = {
        data: 2,
        a
    };

    c.a().fn();
    d.a().fn();
    `;
    highlightCode(test2);
  },
  "怎么使用 for...of 遍历一个对象": () => {
    const list = [
      "for...of 只能遍历可迭代对象，如果遍历对象",
      "需要实现一个 Symbol.iterator 方法",
      "当 for...of 启动时会调用这个方法，这个方法必须返回一个迭代器，一个有 next 方法的对象",
      "当循环希望获得下一个值，会调用这个 next 方法",
      "next 返回的结果格式必须是 {done: boolean, value: any}，当 done 为 true，代表循环结束",
    ];

    // 使用 consoleInfo 显示相关信息
    consoleInfo(list, "怎么使用 for...of 遍历一个对象");

    const codeSnippet = `
    let a = {
        start: 1, // 起始值
        end: 4,   // 结束值
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
                }
            };
        }
    };

    // 使用 for...of 遍历对象
    for (let value of a) {
        console.log(value); // 输出: 1, 2, 3, 4
    }
    `;

    // 高亮代码显示
    highlightCode(codeSnippet);
  },
  /*
  vue源码系列
  */
  响应式原理: () => {
    const list = [
      "Vue的响应式系统在运行时跟踪属性的访问，它通过结合proxy包装器和getter/setter函数来实现",
      "proxy第一个参数是被代理对象，第二个参数是一组traps，通过这些traps可以控制被代理对象的基本操作",
      "对于reactive来说，有get set deleteProperty has ownKeys这些traps，在get中触发track依赖收集",
      "在track内部我们会检查当前是否有正在运行的副作用。如果有，我们会查找到一个存储了所有追踪了该属性的订阅者的 Set，然后将当前这个副作用作为新订阅者添加到该 Set 中",
      "副作用订阅将被存储在一个全局的 WeakMap<target, Map<key, Set<effect>>> 数据结构中。如果在第一次追踪时没有找到对相应属性订阅的副作用集合，它将会在这里新建",
      "在set中处理新增和修改属性，会触发trigger派发更新",
      "在trigger内部，我们会再查找到该属性的所有订阅副作用。但这一次我们需要执行它们",
      "最常见的响应式副作用就是更新dom.每个组件实例创建一个响应式副作用来渲染和更新dom，",
      "而对于ref，返回一个对象，里面有一个响应式属性value,执行getter时，进行track，执行setter时触发trigger，对于setter的参数value则会使用reactive处理",
    ];
    consoleInfo(list, "响应式原理");
  },
  computed原理: () => {
    const list = [
      "使用computed会返回一个对象，它也有一个访问器属性value，初始化时会执行一遍里面的回调函数，搜集依赖",
      "并且还有两个属性dirty和value,dirty初始化设置为true，代表需要重新执行回调，value则是回调return的值",
      "当computed依赖的响应式数据发生变化，dirty被设置为true，当触发getter时会重新执行回调，并更新value，将新值返回",
      "如果依赖没有改变，触发getter不会重新执行回调，而是返回缓存的value",
    ];
    consoleInfo(list, "computed原理");
  },
  nextTick原理: () => {
    const list = [
      "这跟vue的异步更新队列有关，vue会同步将任务放进任务队列，在微任务中执行任务队列",
      "因此要获取最新的dom，需要在微任务执行后再执行",
      "nextTick就是通过promise的链式调用，将nextTick里的回调放在上面的微任务.then里执行",
    ];
    consoleInfo(list, "nextTick原理");
  },
  watch原理: () => {
    const list = [
      "基于vue响应式系统，首先会将watch的第一个参数标准化，也就是getter函数的形式，将其创建为一个响应式副作用，配合调度器控制watch回调的执行",
      "当响应式数据发生改变，触发trigger派发更新，由于调度器的存在，会再次执行watch里的回调，也会执行上面的getter函数拿到新值，旧值通过闭包拿到，最后将新旧值做为回调的参数",
      "通过源码可以发现，watch监听ref reactive数据类型是不同的，当是reactive类型，默认会调用traverse进行深度监听,对于ref类型，不会进行深度监听，通过设置deep：true能实现深度监听",
      "对于flush，这跟组件的更新时机有关系，默认是pre,也就是在父组件更新之后，子组件更新之前执行，post是在组件更新之后，sync则是同步执行",
      "watchEffect则是vue提供的创建响应式副作用的api",
    ];
    consoleInfo(list, "watch原理");
  },
  keepalive原理: () => {
    const list = [
      "卸载时并不会真的卸载，而是移动到一个隐藏容器里，挂载时也不是真的挂载，而是从隐藏容器中取出放在页面上",
      "keepalive有一个特殊标识表明他是缓存组件,keepalive通过ctx实现与渲染器的通信，keepalive会在ctx上实现activate/deactivate,",
    ];
    consoleInfo(list, "keepalive原理");
  },
  /* 
  算法
  */
  递归: () => {
    const list = [
      "三要素：终止条件，参数，return的值",
      "如果依赖子问题的结果，return dfs(node.left)||dfs(node.right)",
      "如果是查找某个子节点符合XX要求，需要根据子问题return的结果做判断，更新全局变量",
    ];
    consoleInfo(list, "递归");
  },
  动态规划: () => {
    const list = [
      "dp[i]代表什么:前i(下标)个的结果或者是以第i个结束的结果,背包问题最好是前i个，而不是下标",
      "需要注意如果有n个数据,要加上0的情况所以需要拿到dp[n],给的参数注意下标,不要越界取错了值",
      "对于最简单的动态规划，尽可能补全初始值，直到判断不了，复杂的可能需要两个for循环",
    ];
    consoleInfo(list, "动态规划");
  },
  "0/1背包": () => {
    const list = [
      "都需要两层for循环,一层循环物品,一层循环背包(从0开始)",
      "二维:dp[i][j]代表从从第0~i个物品中选满足重量j的最大价值",
      "dp[i][j]=Math.max(dp[i-1][j],d[[i-1][j-weight[i]]+value[i]])",
      "一维:dp[j]代表从容量为j的最大价值,为什么能用一维,可以看上当前层只依赖上一层,dp[i]=Math.max(dp[i],dp[i-weight[i]]+value[i]",
      "循环背包时逆序,因为只跟上方和左上方的数据有关,这个时候不能提前更新它",
    ];
    consoleInfo(list, "0/1背包");
    console.log("先初始化数组,长度target+1,添加默认值,先遍历物品,后遍历背包");
    const codeSnippet = ` let dp=new Array(target+1).fill(false)
    dp[0]=true
    for(let i=0;i<nums.length;i++){
      for(let j=target;j>=nums[i];j--){
        dp[j]=dp[j]||dp[j-nums[i]]
      }
    }
    return dp[target]`;
    highlightCode(codeSnippet);
  },
  完全背包: () => {
    const list = [
      "初始化bp数组，长度是背包value+1,设置初始值",
      "let dp = new Array(amount + 1).fill(Infinity)",
      "dp[0] = 0;",
      "两层for循环，外层循环背包，i从1开始，取值要注意减一，内层循环物品，满足条件，进行判断dp[i]=dp[i]||dp[i-cur.length]",
      "注意i，j不要用混了，length不要拼写错误",
    ];
    consoleInfo(list, "完全背包");
    const codeSnippet = `var wordBreak = function(s, wordDict) {
    let dp=new Array(s.length+1).fill(false)
    dp[0]=true
    for(let i=1;i<=s.length;i++){
       for(let j=0;j<wordDict.length;j++){
        let cur = wordDict[j]
        if(i-cur.length>=0&&s.slice(i-cur.length,i)===cur){
            dp[i]=dp[i]||dp[i-cur.length]
        }
       }
    }
    return dp[s.length]
};`;
    highlightCode(codeSnippet);
  },
};
