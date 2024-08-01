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
  vite: {
    ssr: {
      noExternal: ["gsap"],
    },
  },
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
      {
        text: "Javascript",
        items: [
          { text: "grammar", link: "/javascript/grammar/introduction" },
          { text: "application", link: "/javascript/application/firstFrame" },
        ],
      },
      { text: "Web-Api", link: "/Web-Api/ResizeObserver" },
      { text: "pnpm", link: "/pnpm/overview" },
      { text: "浏览器", link: "/brower/overview" },
      { text: "性能优化", link: "/optimization/image" },
    ],

    sidebar: {
      "/javascript/application/": [
        {
          text: "application",
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
      "/javascript/grammar/": [
        {
          text: "grammar",
          items: [
            {
              text: "introduction",
              link: "/javascript/grammar/introduction",
            },
            {
              text: "basic grammar",
              link: "/javascript/grammar/basic",
            },
            {
              text: "module",
              link: "/javascript/grammar/module",
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
      "/pnpm/": [
        {
          text: "pnpm",
          items: [
            { text: "概述", link: "/pnpm/overview" },
            { text: "创建包", link: "/pnpm/createPackage" },
          ],
        },
      ],
      "/brower/": [
        {
          text: "浏览器",
          items: [
            { text: "深入了解现代网络浏览器", link: "/brower/overview" },
            { text: "性能指标", link: "/brower/performanceTags" },
          ],
        },
      ],
      "/optimization/": [
        {
          text: "性能优化",
          items: [{ text: "优化图片", link: "/optimization/image" }],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/dddssw" }],
  },
});
