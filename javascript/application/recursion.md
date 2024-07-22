---
outline: deep
---
获取薪资的总数
```js
let company = {
  sales: [{
    name: 'John',
    salary: 1000
  }, {
    name: 'Alice',
    salary: 1600
  }],

  development: {
    sites: [{
      name: 'Peter',
      salary: 2000
    }, {
      name: 'Alex',
      salary: 1800
    }],

    internals: [{
      name: 'Jack',
      salary: 1300
    }]
  }
};
```
```js
function sumSalaries(data) {
  if (Array.isArray(data)) {
    total = data.reduce((sum, current) => sum + current.salary, 0);
    return total;
  } else {
    let sum = 0;
    for (const value of Object.values(data)) {
      sum += sumSalaries(value);
    }
    return sum;
  }
}
console.log(sumSalaries(data));
```

获取包含从根节点到目标节点的路径上的所有节点的 id

```js
const data = [
  {
    id: 40,
    children: [
      {
        id: 3118,
        children: [
          {
            id: 3119,
            children: [
              {
                id: 3122,
                children: [
                  {
                    id: 3124,
                    children: [
                      {
                        id: 4153,
                        children: [
                          {
                            id: 4154,
                            children: [
                              {
                                id: 4155,
                                children: null,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 3113,
        children: null,
      },
    ],
  },
];

```

```js
function findPathToTargetId(data, target, parent) {
  if (!Array.isArray(data)) {
    if (data.id === target) {
      return [...parent, target];
    } else if (data.children && data.children.length !== 0) {
      return find(data.children, target, [...parent, data.id]);
    } else {
      return null;
    }
  } else {
    for (let val of data) {
      const searchResult = find(val, target, [...parent]);
      if (searchResult) return searchResult;
    }
  }
}
console.log(findPathToTargetId(data, 3113, []));
```