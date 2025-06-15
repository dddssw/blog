---
outline: deep
layout: doc
---

## 组件库 sass
### 主题色
```sass
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
```
### 主题色层次
也就是主题色的10%到90%的变化, 使用 `mix` 来混合颜色
```scss
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

@each $type in $types {
  @for $i from 1 through 9 {
    @include set-color-mix-level($type, $i, 'light', $color-white);
  }
}

// --el-color-primary-dark-2,暗黑模式
@each $type in $types {
  @include set-color-mix-level($type, 2, 'dark', $color-black);
}
```
### :root伪类
通过这个伪类中自定义全局的 `css` 变量,一般以 `--` 开头, 可以确保他们在整个文档中全局可用
```scss
:root {
    --a:#fff
}
background-color:var(--a)
```
### 利用 sass 生成 :root 变量
定义前缀,块,修改器变量,因为是BEM规范
```scss
$namespace: 'el' !default;
$common-separator: '-' !default;
$element-separator: '__' !default;
$modifier-separator: '--' !default;
$state-prefix: 'is-' !default;
```
将色彩映射到root选择器中

:::code-group
```var.scss
@use 'mixins/var' as *;
@use '../common/var' as *;

:root {
    color-scheme: light;
  
    // --el-color-#{$type}
    // --el-color-#{$type}-light-{$i}
    @each $type in (primary, success, warning, danger, error, info) {
      @include set-css-color-type($colors, $type);//$colors是一个map
    }
}
```
```mixins/_var.scss
@use 'function' as *;

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

// set css var value, because we need translate value to string
// for example:
// @include set-css-var-value(('color', 'primary'), red);
// --el-color-primary: red;
@mixin set-css-var-value($name, $value) {
    #{joinVarName($name)}: #{$value};
  }
```
```mixins/function.scss
// join var name
// joinVarName(('button', 'text-color')) => '--el-button-text-color'
@function joinVarName($list) {
    $name: '--' + config.$namespace;
    @each $item in $list {
      @if $item != '' {
        $name: $name + '-' + $item;
      }
    }
    @return $name;
  }
```
:::

### 使用root里的变量名词
:::code-group
```mixins/function.scss
// getCssVar('button', 'text-color') => var(--el-button-text-color)
@function getCssVar($args...) {
  @return var(#{joinVarName($args)});
}
```
```example
color: getCssVar('color', 'primary')
```
:::

对于组件库的样式,可以通过class或者style来修改.比如el-row的justify属性,他会声明不同的样式
:::code-group
```row.scss
@use 'common/var' as *;
@use 'mixins/mixins' as *;
@use 'mixins/utils' as *;

@include b(row) {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  box-sizing: border-box;

  @include when(justify-center) {
    justify-content: center;
  }
  @include when(justify-end) {
    justify-content: flex-end;
  }
  @include when(justify-space-between) {
    justify-content: space-between;
  }
  @include when(justify-space-around) {
    justify-content: space-around;
  }
  @include when(justify-space-evenly) {
    justify-content: space-evenly;
  }
  @include when(align-top) {
    align-items: flex-start;
  }
  @include when(align-middle) {
    align-items: center;
  }
  @include when(align-bottom) {
    align-items: flex-end;
  }
}
```
```mixin.scss
@mixin when($state) {
  @at-root {
    &.#{$state-prefix + $state} {
      @content;
    }
  }
}
```
:::