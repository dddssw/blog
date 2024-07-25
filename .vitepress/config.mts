import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "dddssw'blog",
  description: "A VitePress Site",
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
  },
  base: "/blog/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/images.jfif",
    // search: {
    //   provider: "local",
    // },
    search: {
      provider: "algolia",
      options: {
        appId: "SFY0AY60MT",
        apiKey: "4c70609587914b9a41186e78d4660299",
        indexName: "dddsswio",
      },
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
      {
        text: "Javascript",
        items: [
          { text: "语法", link: "/item-1" },
          { text: "应用", link: "/javascript/application/firstFrame" },
        ],
      },
      { text: "Web-Api", link: "/Web-Api/ResizeObserver" },
    ],

    sidebar: {
      "/Examples/": [
        {
          text: "Examples",
          items: [
            { text: "Markdown Examples", link: "/markdown-examples" },
            { text: "Runtime API Examples", link: "/api-examples" },
          ],
        },
      ],
      "/javascript/application/": [
        {
          text: "应用",
          items: [
            {
              text: "获取视频第一(n)帧",
              link: "/javascript/application/firstFrame",
            },
            { text: "递归", link: "/javascript/application/recursion" },
            {
              text: "富文本提取纯文字",
              link: "/javascript/application/extractText",
            },
          ],
        },
      ],
      "/Web-Api/": [
        {
          text: "Web-Api",
          // collapsed: true,
          items: [
            { text: "ResizeObserver", link: "/Web-Api/ResizeObserver" },
            { text: "XMLHttpRequest", link: "/Web-Api/XMLHttpRequest" },
            { text: "Web Storage API", link: "/Web-Api/StorageAPI" },
            { text: "高亮API", link: "/Web-Api/Highlight" },
            { text: "同源通信", link: "/Web-Api/sameOrigin" },
            { text: "CSS 对象模型（CSSOM）", link: "/Web-Api/cssom" },
            { text: "File API", link: "/Web-Api/file" },
            { text: "Canvas", link: "/Web-Api/canvas" },
            { text: "拖拽API", link: "/Web-Api/dragAnddrop" },
            { text: "History API", link: "/Web-Api/history" },
            {
              text: "Intersection Observer API",
              link: "/Web-Api/intersection",
            },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/dddssw" }],
  },
});
