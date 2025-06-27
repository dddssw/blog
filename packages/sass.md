---
outline: deep
layout: doc
---
## 变量
以 `$` 开头,用来存放在样式表重复使用的信息

库通常使用 `！default` 变量来允许用户配置库的 CSS

| 操作 | 结果 | 说明 |
|------|------|------|
| `$var: "A"; $var: "B"` | `$var = "B"` | 直接覆盖原值 |
| `$var: "A"; $var: "B" !default` | `$var = "A"` | 保留原值（默认值不生效） |
| `$var: null; $var: "B" !default` | `$var = "B"` | `null` 视为未定义，应用默认值 |

::: code-group 
```_library.scss
$black: #000 !default;
$border-radius: 0.25rem !default;
$box-shadow: 0 0.5rem 1rem rgba($black, 0.15) !default;

code {
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}
```
```style.scss
@use 'library' with (
  $black: #222,
  $border-radius: 0.1rem
);
```
```res.css
code {
  border-radius: 0.1rem;
  box-shadow: 0 0.5rem 1rem rgba(34, 34, 34, 0.15);
}
```
:::
## 插值
`#{}`, 插值始终返回未加引号的 字符串
```scss
@mixin corner-icon($name, $top-or-bottom, $left-or-right) {
  .icon-#{$name} {
    background-image: url("/icons/#{$name}.svg");
    position: absolute;
    #{$top-or-bottom}: 0;
    #{$left-or-right}: 0;
  }
}

@include corner-icon("mail", top, left);
```
## 模块
不必将所有 Sass 文件都写在一个文件中。您可以使用@use规则将其拆分成任意大小。此规则会将另一个 Sass 文件加载为 module，这意味着您可以在 Sass 文件中使用基于文件名的命名空间来引用其变量、mixins和 函数. 无需包含文件扩展名
```css
// _base.scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```
```css
// styles.scss
@use 'base';

.inverse {
  background-color: base.$primary-color;
  color: white;
}
```
## mixin
使用 `@mixin` 定义, 使用方式 `@mixin <name> { ... }` or `@mixin name(<arguments...>) { ... }`

使用上 `@include <name>` or `@include <name>(<arguments...>)`

接收的参数不仅可以当成 `value` 使用也可以使用插值充当 `key`

也允许默认值 `@mixin replace-text($image, $x: 50%, $y: 50%)`

传递参数时可以按顺序传递也可以按名称传递,语法与默认参数是一致的 `@include square(100px, $radius: 4px);`

除了接受参数之外，mixin 还可以接受一整块样式，即内容块。mixin 可以通过在其主体中包含 `@content` 规则来声明它接受的内容块
## @extend
@extend 允许你将一个选择器的 CSS 属性​​共享​​给另一个选择器，避免重复代码

多个类（如 .error、.warning、.success）需要共用相同的基样式（如字体、边距）。
 ::: code-group 
 ```scss
// 定义占位符类（%开头不会被直接编译）
%message-shared {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

// 通过 @extend 继承占位符类
.error {
  @extend %message-shared;
  border-color: red;
}

.success {
  @extend %message-shared;
  border-color: green;
}
```
```css
.message-shared, .error { /* .message-shared 可能并不需要 */
  border: 1px solid #ccc;
  padding: 10px;
}
.error {
  border-color: red;
}
```
 :::

## 变量的数据类型
### map
::: code-group
```查找
@use "sass:map";
$font-weights:() !default
$font-weights: ("regular": 400, "medium": 500, "bold": 700);

@debug map.get($font-weights, "medium"); // 500
@debug map.get($font-weights, "extra-bold"); // null
```
```循环
$icons: ("eye": "\f112", "start": "\f12e", "stop": "\f12f");

@each $name, $glyph in $icons {
  .icon-#{$name}:before {
    display: inline-block;
    font-family: "Icon Font";
    content: $glyph;
  }
}
```
```设置
@use "sass:map";

$font-weights: ("regular": 400, "medium": 500, "bold": 700);

@debug map.set($font-weights, "extra-bold", 900);
// ("regular": 400, "medium": 500, "bold": 700, "extra-bold": 900)
@debug map.set($font-weights, "bold", 900);
// ("regular": 400, "medium": 500, "bold": 900)
```
:::