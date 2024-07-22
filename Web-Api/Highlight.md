---
layout: doc
outline: deep
---
> [!IMPORTANT]
> CSS 自定义高亮 API 提供了一种方法，可以通过使用 JavaScript 创建范围并使用 CSS 定义样式来设置文档中任意文本范围的样式。

使用 CSS 自定义高亮 API，你可以通过编程方式创建文本范围并高亮显示它们，而不会影响页面中的 DOM 结构。

使用 CSS 自定义高亮 API 设置网页上文本范围的样式有四个步骤：

1. 创建 Range 对象。
2. 为这些范围创建 Highlight 对象。
3. 使用 HighlightRegistry 进行注册。
4. 使用 ::highlight() 伪元素定义高亮样式。

```html
<label>Search within text <input id="query" type="text" /></label>
<article>
  <p>
    Maxime debitis hic, delectus perspiciatis laborum molestiae labore,
    deleniti, quam consequatur iure veniam alias voluptas nisi quo. Dolorem
    eaque alias, quo vel quas repudiandae architecto deserunt quidem, sapiente
    laudantium nulla.
  </p>
  <p>
    Maiores odit molestias, necessitatibus doloremque dolor illum reprehenderit
    provident nostrum laboriosam iste, tempore perferendis! Ab porro neque esse
    voluptas libero necessitatibus fugiat, ex, minus atque deserunt veniam
    molestiae tempora? Vitae.
  </p>
  <p>
    Dolorum facilis voluptate eaque eius similique ducimus dignissimos assumenda
    quos architecto. Doloremque deleniti non exercitationem rerum quam alias
    harum, nisi obcaecati corporis temporibus vero sapiente voluptatum est
    quibusdam id ipsa.
  </p>
</article>

```
使用 JavaScript 监听搜索框上的 input 事件，当事件触发，这段代码将在文章的文本中为输入文本查找匹配项。然后它创建匹配的范围，并使用 CSS 自定义高亮 API 创建并注册一个 search-results 高亮对象：

```js
const query = document.getElementById("query");
const article = document.querySelector("article");

// Find all text nodes in the article. We'll search within
// these text nodes.
const treeWalker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
const allTextNodes = [];
let currentNode = treeWalker.nextNode();
while (currentNode) {
  allTextNodes.push(currentNode);
  currentNode = treeWalker.nextNode();
}

// Listen to the input event to run the search.
query.addEventListener("input", () => {
  // If the CSS Custom Highlight API is not supported,
  // display a message and bail-out.
  if (!CSS.highlights) {
    article.textContent = "CSS Custom Highlight API not supported.";
    return;
  }

  // Clear the HighlightRegistry to remove the
  // previous search results.
  CSS.highlights.clear();

  // Clean-up the search query and bail-out if
  // if it's empty.
  const str = query.value.trim().toLowerCase();
  if (!str) {
    return;
  }

  // Iterate over all text nodes and find matches.
  const ranges = allTextNodes
    .map((el) => {
      return { el, text: el.textContent.toLowerCase() };
    })
    .map(({ text, el }) => {
      const indices = [];
      let startPos = 0;
      while (startPos < text.length) {
        const index = text.indexOf(str, startPos);
        if (index === -1) break;
        indices.push(index);
        startPos = index + str.length;
      }

      // Create a range object for each instance of
      // str we found in the text node.
      return indices.map((index) => {
        const range = new Range();
        range.setStart(el, index);
        range.setEnd(el, index + str.length);
        return range;
      });
    });

  // Create a Highlight object for the ranges.
  const searchResultsHighlight = new Highlight(...ranges.flat());

  // Register the Highlight object in the registry.
  CSS.highlights.set("search-results", searchResultsHighlight);
});

```
最后，在 CSS 中使用 ::highlight() 伪元素来设置高亮样式。
```css
::highlight(search-results) {
  background-color: #f06;
  color: white;
}

```