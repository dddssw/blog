---
outline: deep
layout: doc
---

模块可以相互加载，并可以使用特殊的指令 export 和 import 来交换功能

## 浏览器的支持

由于模块支持特殊的关键字和功能，因此我们必须通过使用 &lt;script type="module">&lt;/script> 特性（attribute）来告诉浏览器，此脚本应该被当作模块（module）来对待。

浏览器会自动获取解析导入的模块，并执行该脚本

## 特性

1. 默认严格模式
2. 模块级作用域，一个模块中的顶级作用域变量和函数在其他脚本中是不可见的
3. 模块代码仅在第一次导入时被解析

如果同一个模块被导入到多个其他位置，那么它的代码只会执行一次，即在第一次被导入时。然后将其导出（export）的内容提供给进一步的导入（importer）。

这里有一条规则：顶层模块代码应该用于初始化，创建模块特定的内部数据结构。如果我们需要多次调用某些东西 —— 我们应该将其以函数的形式导出

```js
// 📁 admin.js
export let admin = {
  name: "John",
};
```

如果这个模块被导入到多个文件中，模块仅在第一次被导入时被解析，并创建 admin 对象，然后将其传入到所有的导入。

所有的导入都只获得了一个唯一的 admin 对象：

```js
// 📁 1.js
import { admin } from "./admin.js";
admin.name = "Pete";

// 📁 2.js
import { admin } from "./admin.js";
alert(admin.name); // Pete

// 1.js 和 2.js 引用的是同一个 admin 对象
// 在 1.js 中对对象做的更改，在 2.js 中也是可见的
```

## import.meta

import.meta 对象包含关于当前模块的信息。

它的内容取决于其所在的环境。在浏览器环境中，它包含当前脚本的 URL

```js
// 📁 a.html
<script type="module">
    import * as a from './a.js'
</script>

// 📁 a.js
console.log(import.meta.url) //http://127.0.0.1:5500/a.js
```

## 模块脚本总是延迟的
相当于设置了defer,模块脚本会等到 HTML 文档完全准备就绪（即使它们很小并且比 HTML 加载速度更快），然后才会运行。

## 不允许裸模块（“bare” module）
在浏览器中，import 必须给出相对或绝对的 URL 路径。没有任何路径的模块被称为“裸（bare）”模块。在 import 中不允许这种模块。有些打包工具比如vite扩展了这一功能

## async适应
对于非模块脚本，async 特性（attribute）仅适用于外部脚本。异步脚本会在准备好后立即运行，独立于其他脚本或 HTML 文档。

对于模块脚本，它也适用于内联脚本。

例如，下面的内联脚本具有 async 特性，因此它不会等待任何东西。

它执行导入（fetch ./analytics.js），并在导入完成时运行，即使 HTML 文档还未完成，或者其他脚本仍在等待处理中。

这对于不依赖任何其他东西的功能来说是非常棒的，例如计数器，广告，文档级事件监听器。

```js
<!-- 所有依赖都获取完成（analytics.js）然后脚本开始运行 -->
<!-- 不会等待 HTML 文档或者其他 <script> 标签 -->
<script async type="module">
  import {counter} from './analytics.js';

  counter.count();
</script>
```

## 全部导入 Import *
```js
// 📁 main.js
import * as say from './say.js';

say.sayHi('John');
say.sayBye('John');
```
1. 不利于树摇
2. 名字太长
3. 不利于重构

## 起别名 Import “as” Export “as”

## Export default
在实际中，主要有两种模块。

包含库或函数包的模块，像上面的 say.js。
声明单个实体的模块，例如模块 user.js 仅导出 class User。

模块提供了一个特殊的默认导出 export default 语法，以使“一个模块只做一件事”的方式看起来更好。

将 export default 放在要导出的实体前：
```js
// 📁 user.js
export default class User { // 只需要添加 "default" 即可
  constructor(name) {
    this.name = name;
  }
}
```
每个文件应该只有一个 export default：

……然后将其导入而不需要花括号：
```js
// 📁 main.js
import User from './user.js'; // 不需要花括号 {User}，只需要写成 User 即可

new User('John');
```

| 命名的导出                   | 默认的导出                    |
|----------------------------|-----------------------------|
| `export class User {...}`  | `export default class User {...}` |
| `import {User} from ...`   | `import User from ...`       |


从技术上讲，我们可以在一个模块中同时有默认的导出和命名的导出，但是实际上人们通常不会混合使用它们。模块要么是命名的导出要么是默认的导出。

由于每个文件最多只能有一个默认的导出，因此导出的实体可能没有名称。

例如，下面这些都是完全有效的默认的导出：

```js
export default class { // 没有类名
  constructor() { ... }
}
export default function(user) { // 没有函数名
  alert(`Hello, ${user}!`);
}
// 导出单个值，而不使用变量
export default ['Jan', 'Feb', 'Mar','Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
```
不指定名称是可以的，因为每个文件只有一个 export default，因此不带花括号的 import 知道要导入的内容是什么。

## 特殊的“default”
```js
// 导出事先定义的特性作为默认值
export { myFunction as default };
// 这等同于：
export default myFunction;
```

当默认导出，命名导出都存在，无需编写两条单独的导入及导出语句
```js
// 📁 main.js
import {default as User, sayHi} from './user.js';

new User('John');
```

如果我们将所有东西 * 作为一个对象导入，那么 default 属性正是默认的导出：
```js
// 📁 main.js
import * as user from './user.js';

let User = user.default; // 默认的导出
new User('John');
```

## 重新导出
“重新导出（Re-export）”语法 export ... from ... 允许导入内容，并立即将其导出（可能是用的是其他的名字），就像这样：

```js
export {sayHi} from './say.js'; // 重新导出 sayHi

export {default as User} from './user.js'; // 重新导出 default
```
但是这里对于默认导出会复杂些，所以有的开发者不喜欢使用它

## 动态导入
在前面介绍的导出和导入语句称为“静态”导入。语法非常简单且严格。

首先，我们不能动态生成 import 的任何参数。

模块路径必须是原始类型字符串，不能是函数调用。其次，我们无法根据条件或者在运行时导入

这是因为 import/export 旨在提供代码结构的主干。这是非常好的事儿，因为这样便于分析代码结构，可以收集模块，可以使用特殊工具将收集的模块打包到一个文件中，可以删除未使用的导出（“tree-shaken”）。这些只有在 import/export 结构简单且固定的情况下才能够实现。

### import() 表达式
import(module) 表达式加载模块并返回一个 promise，该 promise resolve 为一个包含其所有导出的模块对象。我们可以在代码中的任意位置调用这个表达式。

我们可以在代码中的任意位置动态地使用它。例如：
```js
let modulePath = prompt("Which module to load?");

import(modulePath)
  .then(obj => <module object>)
  .catch(err => <loading error, e.g. if no such module>)

```

需要注意的是say.js 有默认的导出：
```js
// 📁 say.js
export default function() {
  alert("Module loaded (export default)!");
}
```
……那么，为了访问它，我们可以使用模块对象的 default 属性：
```js
let obj = await import('./say.js');
let say = obj.default;
// or, in one line: let {default: say} = await import('./say.js');解构的默认值

say();
```