---
outline: deep
layout: doc
---

ui组件库的特点
* 可重用性,提高开发效率
* 一致性,设计风格一致
* 易用性,组件经过设计和测试,具有良好的用户体验
* 定制性,允许开发人员按照自己的需求和设计风格进行定制

## 目录结构
1. Element Plus 的根目录

.circleci：用于 Circle CI 自动化部署的配置文件。  
.github：存放 GitHub 的配置文件，如 issue、PR 模板等。  
.husky：用于 Git 钩子的配置。  
.vscode：为 VSCode 提供的配置文件。  
docs：使用 VitePress 生成的文档配置。  
internal：内部工具和脚本。  
play：测试项目。  
scripts：构建脚本。  
typings：类型定义文件。  
packages：核心目录，包含所有功能包 。  

2. packages 目录结构  
packages 是 Element Plus 的核心目录，包含多个功能包，每个包都具有清晰的结构。以下是主要包的结构和功能：

2.1 components 
功能：存放所有 UI 组件的源码。  
2.2 utils 
2.3 theme-chalk
提供组件的样式文件（SCSS）。   
2.4 element-plus
对外暴露的包，是组件库的统一出口。导出所有组件和功能。    
index.ts：入口文件，用于集中注册组件。   
2.5 hooks
存放自定义 hook 函数。  
2.7 directives  
2.8 test-utils  
功能：测试工具和辅助函数。  
2.9 constants   
功能：存放公用常量。

3.组件 目录结构
3.1 src包含.vue,style文件
3.2 index.ts 访问组件的入口文件
## 使用monorepo构建
适用于大型项目,和具有多个相互依赖部分的application

搭建好目录之后,他们都变成了独立的包.要使他们可以相互调用,需要在根目录下按照依赖即可

例如 `pnpm i @template/components@workspace:* -w`

## 如何实现完整引入
```js
import ElementPlus from 'element-plus'

const app = createApp(App)
app.use(ElementPlus)
```
packages下的element-plus是组件库的统一出口

ElementPlus是一个插件,他实际上是一个包含install的对象

他是这么生成的

```js
//packages/element-plus
makeInstaller([...Components])
export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, options?: ConfigProviderContext) => {//这里实现了第一个install方法
    if (app[INSTALLED_KEY]) return

    app[INSTALLED_KEY] = true
    components.forEach((c) => app.use(c))//这里会用到下面注入的install

    if (options) provideGlobalConfig(options, app, true)
  }

  return {
    version,
    install,
  }
}

//packages/components/*
//对于每个组件,导出的时候使用withInstall方法处理一下,作用是注入一个install方法,返回这个组件而已
export const ElAffix: SFCWithInstall<typeof Affix> = withInstall(Affix)
export const withInstall = <T, E extends Record<string, any>>(
  main: T,
  extra?: E
) => {
  ;(main as SFCWithInstall<T>).install = (app): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp)
    }
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      ;(main as any)[key] = comp
    }
  }
  return main as SFCWithInstall<T> & E
}
```
## 实现按需手动导入
因为每个组件都被导出了,所有只需要`export * from '@element-plus/components'`即可,就可以被引用了

样式>>>>>>>>>wait

## 实现按需自动加载
只需要添加两个插件`unplugin-vue-components 和 unplugin-auto-import`
一个负责自动扫描和注册vue组件,包括流行ui库以及src/components的所有组件

另一个负责导入流行库的api

## sass制定组件库全局变量
像主题色,组件尺寸,文字大小等组件库的全局样式属性规范,使用 `sass` 以变量的形式生成这些属性

拿主题色举例,`map` 使用小括号分隔的
:::code-group
```scss [common/var.scss] 基础主题色
// Color
$colors: () !default;
$colors: map.deep-merge(
  (
    'white': #ffffff,
    'black': #000000,
    'primary': (
      'base': #409eff,
    ),
    'success': (
      'base': #67c23a,
    ),
    'warning': (
      'base': #e6a23c,
    ),
    'danger': (
      'base': #f56c6c,
    ),
    'error': (
      'base': #f56c6c,
    ),
    'info': (
      'base': #909399,
    ),
  ),
  $colors
);
//色调
$color-white: map.get($colors, 'white') !default;
$color-black: map.get($colors, 'black') !default;
$color-primary: map.get($colors, 'primary', 'base') !default;
$color-success: map.get($colors, 'success', 'base') !default;
$color-warning: map.get($colors, 'warning', 'base') !default;
$color-danger: map.get($colors, 'danger', 'base') !default;
$color-error: map.get($colors, 'error', 'base') !default;
$color-info: map.get($colors, 'info', 'base') !default;
```
```scss [common/var.scss] 层次主题色
//通过deep-merge合并到$colors
// types
$types: primary, success, warning, danger, error, info;
@mixin set-color-mix-level(
  $type,
  $number,
  $mode: 'light',
  $mix-color: $color-white
) {
  $colors: map.deep-merge(
    (
      $type: (
        '#{$mode}-#{$number}':
          color.mix(
            $mix-color,
            map.get($colors, $type, 'base'),
            math.percentage(math.div($number, 10))
          ),
      ),
    ),
    $colors
  ) !global;
}

//使用mixin
@each $type in $types {
  @for $i from 1 through 9 {
    @include set-color-mix-level($type, $i, 'light', $color-white);
  }
}

// --el-color-primary-dark-2
@each $type in $types {
  @include set-color-mix-level($type, 2, 'dark', $color-black);
}
```
```css [生成的结果]
'primary': (
  'base': #409eff,
  'light-1': #53a8ff,  // 主色混合 10% 白色
  'light-2': #66b1ff,  // 混合 20% 白色
  ...
  'light-9': #ecf5ff   // 混合 90% 白色
)
```
:::

### 将变量挂载到root上
这样变成了css变量,相当于全局都可以使用

`set-css-var-value​` ​：用于生成原子级 CSS 变量（如颜色、单数值）  
​`​set-component-css-var​` ​：用于将结构化 Map 变量批量转换为 CSS 变量，实现组件样式的集中管理
:::code-group
```scss [var.scss]
:root {
  // --el-color-#{$type}
  // --el-color-#{$type}-light-{$i}
  @each $type in (primary, success, warning, danger, error, info) {
    @include set-css-color-type($colors, $type);//mixins/_var.scss
  }
}
```
```scss [mixins/_var.scss]
@mixin set-css-color-type($colors, $type) {
  @include set-css-var-value(('color', $type), map.get($colors, $type, 'base'));

  @each $i in (3, 5, 7, 8, 9) {
    @include set-css-var-value(
      ('color', $type, 'light', $i),
      map.get($colors, $type, 'light-#{$i}')
    );
  }

  @include set-css-var-value(
    ('color', $type, 'dark-2'),
    map.get($colors, $type, 'dark-2')
  );
}
// for example:
// @include set-css-var-value(('color', 'primary'), red);
// --el-color-primary: red;
@mixin set-css-var-value($name, $value) {
  #{joinVarName($name)}: #{$value};//function.scss
}
```
```scss [function.scss]
@function joinVarName($list) {
  $name: '--' + config.$namespace;//组件库的前缀
  @each $item in $list {
    @if $item != '' {
      $name: $name + '-' + $item;
    }
  }
  @return $name;
}
```
:::

::: code-group
```scss [var.scss]
:root{
  @include set-component-css-var('font-size', $font-size);
}
```
```scss [mixins/_var.scss]
// set all css var for component by map
@mixin set-component-css-var($name, $variables) {
  @each $attribute, $value in $variables {
    @if $attribute == 'default' {
      #{getCssVarName($name)}: #{$value};
    } @else {
      #{getCssVarName($name, $attribute)}: #{$value};
    }
  }
}
```
```scss [function.scss]
// getCssVarName('button', 'text-color') => '--el-button-text-color'
@function getCssVarName($args...) {
  @return joinVarName($args);
}
```
:::

使用
:::code-group
```scss [mixins/function.scss]
// getCssVar('button', 'text-color') => var(--el-button-text-color)
@function getCssVar($args...) {
  @return var(#{joinVarName($args)});
}
```
``` scss
padding: getCssVar('alert', 'padding');
```
:::
将ui库全局变量赋值给组件的私有变量,例如button组件里生成了私有的css变量

### BEM
使用的是BEM命名规则,组件用-连接,元素用__连接,类型用--连接,状态用is-xx表示

编写组件时,如果都是手写类名,写法繁琐,可以把BEM命名规则封装风函数,动态生成类名

```js
export const defaultNamespace = 'el'
const statePrefix = 'is-'

export const useGetDerivedNamespace = (//这个函数可以更改命名空间方便二次开发
  namespaceOverrides?: Ref<string | undefined>
) => {
  const derivedNamespace =
    namespaceOverrides ||
    (getCurrentInstance()
      ? inject(namespaceContextKey, ref(defaultNamespace))
      : ref(defaultNamespace))
  const namespace = computed(() => {
    return unref(derivedNamespace) || defaultNamespace
  })
  return namespace
}

const _bem = (
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string
) => {
  let cls = `${namespace}-${block}`
  if (blockSuffix) {
    cls += `-${blockSuffix}`
  }
  if (element) {
    cls += `__${element}`
  }
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}

export const useNamespace = (
  block: string,
  namespaceOverrides?: Ref<string | undefined>
) => {
  const namespace = useGetDerivedNamespace(namespaceOverrides)
  const b = (blockSuffix = '') =>
    _bem(namespace.value, block, blockSuffix, '', '')
  const e = (element?: string) =>
    element ? _bem(namespace.value, block, '', element, '') : ''
  const m = (modifier?: string) =>
    modifier ? _bem(namespace.value, block, '', '', modifier) : ''
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element
      ? _bem(namespace.value, block, blockSuffix, element, '')
      : ''
  const em = (element?: string, modifier?: string) =>
    element && modifier
      ? _bem(namespace.value, block, '', element, modifier)
      : ''
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier
      ? _bem(namespace.value, block, blockSuffix, '', modifier)
      : ''
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? _bem(namespace.value, block, blockSuffix, element, modifier)
      : ''
  const is: {
    (name: string, state: boolean | undefined): string
    (name: string): string
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0]! : true
    return name && state ? `${statePrefix}${name}` : ''
  }

  // for css var
  // --el-xxx: value;
  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${key}`] = object[key]
      }
    }
    return styles
  }
  // with block
  const cssVarBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object[key]
      }
    }
    return styles
  }

  const cssVarName = (name: string) => `--${namespace.value}-${name}`
  const cssVarBlockName = (name: string) =>
    `--${namespace.value}-${block}-${name}`

  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    // css
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName,
  }
}
```
```js
//拿affix组件举例
import { useNamespace } from '@element-plus/hooks'
const ns = useNamespace('affix')
<div ref="root" :class="ns.b()" :style="rootStyle"></div>
```




### 遵守BEM命名规则生成组件类名
1. 生成块的类名
::: code-group
```scss [mixin/mixins.scss]
// BEM
@mixin b($block) {
  $B: $namespace + $common-separator + $block !global;

  .#{$B} {
    @content;
  }
}

@mixin e($element) {
  $E: $element !global;
  $selector: &;
  $currentSelector: '';
  @each $unit in $element {
    $currentSelector: #{$currentSelector +
      '.' +
      $B +
      $element-separator +
      $unit +
      ','};
  }

  @if hitAllSpecialNestRule($selector) {
    @at-root {
      #{$selector} {
        #{$currentSelector} {
          @content;
        }
      }
    }
  } @else {
    @at-root {
      #{$currentSelector} {
        @content;
      }
    }
  }
}

@mixin m($modifier) {
  $selector: &;
  $currentSelector: '';
  @each $unit in $modifier {
    $currentSelector: #{$currentSelector +
      $selector +
      $modifier-separator +
      $unit +
      ','};
  }

  @at-root {
    #{$currentSelector} {
      @content;
    }
  }
}
@mixin when($state) {
  @at-root {
    &.#{$state-prefix + $state} {
      @content;
    }
  }
}
```
``` scss [use]
@use 'mixins/mixins' as *;
@use 'mixins/var' as *;
@use 'common/var' as *;

@include b(alert) {
  @include set-component-css-var('alert', $alert);

  width: 100%;
  padding: getCssVar('alert', 'padding');
  margin: 0;
  box-sizing: border-box;
  border-radius: getCssVar('alert', 'border-radius-base');
  position: relative;
  background-color: getCssVar('color', 'white');
  overflow: hidden;
  opacity: 1;
  display: flex;
  align-items: center;
  transition: opacity getCssVar('transition-duration', 'fast');

  @include when(light) {
    .#{$namespace}-alert__close-btn {
      color: getCssVar('text-color', 'placeholder');
    }
  }

  @include when(dark) {
    .#{$namespace}-alert__close-btn {
      color: getCssVar('color', 'white');
    }
    .#{$namespace}-alert__description {
      color: getCssVar('color', 'white');
    }
  }

  @include when(center) {
    justify-content: center;
  }

  @each $type in (success, info, warning, error) {
    @include m($type) {
      @include css-var-from-global(
        ('alert', 'bg-color'),
        ('color', $type, 'light-9')
      );

      &.is-light {
        background-color: getCssVar('alert', 'bg-color');
        color: getCssVar('color', $type);

        .#{$namespace}-alert__description {
          color: getCssVar('color', $type);
        }
      }

      &.is-dark {
        background-color: getCssVar('color', $type);
        color: getCssVar('color', 'white');
      }
    }
  }

  @include e(content) {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  & .#{$namespace}-alert__icon {
    font-size: getCssVar('alert', 'icon-size');
    width: getCssVar('alert', 'icon-size');
    margin-right: 8px;

    @include when(big) {
      font-size: getCssVar('alert', 'icon-large-size');
      width: getCssVar('alert', 'icon-large-size');
      margin-right: 12px;
    }
  }

  @include e(title) {
    font-size: getCssVar('alert', 'title-font-size');
    line-height: 24px;

    &.with-description {
      font-size: getCssVar('alert', 'title-with-description-font-size');
    }
  }

  & .#{$namespace}-alert__description {
    font-size: getCssVar('alert', 'description-font-size');
    margin: 0;
  }

  & .#{$namespace}-alert__close-btn {
    font-size: getCssVar('alert', 'close-font-size');
    opacity: 1;
    position: absolute;
    top: 12px;
    right: 16px;
    cursor: pointer;

    @include when(customed) {
      font-style: normal;
      font-size: getCssVar('alert', 'close-customed-font-size');
      line-height: 24px;
      top: 8px;
    }
  }
}

.#{$namespace}-alert-fade-enter-from,
.#{$namespace}-alert-fade-leave-active {
  opacity: 0;
}
```
:::
