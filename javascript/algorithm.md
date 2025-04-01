---
outline: deep
---
## 递归
如果依赖子问题的结果，return dfs(node.left)||dfs(node.right)，当然这只是一个示例，来利用子问题的结果

如果不依赖子问题的结果，例如查找某个子节点符合XX要求，需要根据子问题return的结果做判断，更新全局变量，所以一般需要在一个函数里执行一个dfs函数

考虑：终止条件，接受参数，return的值

当然终止条件并不是node为空即可，具体场景有更复杂的判断

参数的话可以考虑不仅仅一个node，或者两个node，或者一个node,一个其他的什么数据

::: tip 悟了
如果输入的问题本来就是一个大问题，只需要一个dfs

如果是需要接受一些别的参数，而不是仅仅是大问题，需要辅助函数dfs
:::
### 二叉树

层序遍历（需要一个队列，一个方向出栈，另一个方向入栈）,要对空树做一个额外的判断

```js
var levelOrder = function (root) {
  if (!root) {
    return [];
  }
  const stack = [root];
  const res = [];
  while (stack.length) {
    let len = stack.length;
    let levelRes = [];
    for (let i = 0; i < len; i++) {
      const cur = stack.shift();
      levelRes.push(cur.val);
      if (cur.left) {
        stack.push(cur.left);
      }
      if (cur.right) {
        stack.push(cur.right);
      }
    }
    res.push(levelRes);
  }
  return res;
};

```
### 将有序数组转成二叉搜索树
二叉搜索树的中序遍历就是有序数组

显然，子问题的结果依赖上个子问题的结果。所以dfs return的值很关键

dfs接受两个参数分别代表起始和终点

```js
var sortedArrayToBST = function (nums) {
  function dfs(left, right) {
    if (left > right) {
      return null;
    }
    let index = Math.floor((left + right) / 2);
    let node = new TreeNode(nums[index])
    node.left = dfs(left, index-1);
    node.right = dfs(index+1, right);
    return node
  }
  return dfs(0, nums.length - 1);
};

```

### 对称二叉树
dfs也接受两个参数，当然最开始是都是root
### 最近的祖先节点
感觉很经典

```js
var lowestCommonAncestor = function (root, p, q) {
  let res;
  function dfs(node) {
    if (!node||res) {
      return false;
    }
    const left = dfs(node.left)//先拿到子问题的答案再说
    const right = dfs(node.right)//先拿到子问题的答案再说
    //根据子问题答案来确定当前这个节点是否符合要求，不符合就考虑它的return
    if(left&&right){
        res = node
    }
    if((node===p||node===q)&&(left||right)){
        res=node
    }
    return (node === p || node === q)||left||right;
  }
  dfs(root)
  return res
};
```
### 路径总和|||
这个思路都是一样的，记录总数以及个数在map里，这个map初始数组 new Map([[0,1]])。再声明一个总和sum

它不需要依赖子问题的答案，因为已经记录在map里，然后类似于回溯吧，递归完还原map和sum
### 从前序，中序构造二叉树
从前序可以知道根节点，但是怎么在中序中找到这个节点，除了二分查找之外，也可以使用一个map保存数据及其下标
### 递归转迭代（抽象）
需要一个栈，以及一个变量来记住当前遍历的节点