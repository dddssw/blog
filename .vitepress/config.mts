import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "dddssw'blog",
  description: "A VitePress Site",
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
  },
  head: [
    ["link", { rel: "icon", href: "/blog/images.jfif" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    ],
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
        rel: "stylesheet",
      },
    ],
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-RYWJMQZD8D",
      },
    ],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-RYWJMQZD8D');`,
    ],
  ],
  base: "/blog/",
  vite: {
    ssr: {
      noExternal: ["gsap"],
    },
    optimizeDeps: {
      entries: [],
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
          { text: "算法", link: "/javascript/algorithm" },
        ],
      },
      { text: "Rust", link: "/rust/start" },
      {
        text: "框架",
        items: [
          { text: "Vue", link: "/frame/vue/reactivity" },
          { text: "React", link: "/frame/react/start" },
        ],
      },
      { text: "Web-Api", link: "/Web-Api/ResizeObserver" },
      { text: "pnpm", link: "/pnpm/overview" },
      { text: "vscode", link: "/vscode/extension" },
      {
        text: "browser",
        items: [
          { text: "about", link: "/browser/about/overview" },
          { text: "dev-tool", link: "/browser/devtool/source" },
          { text: "http", link: "/browser/http/introduct" },
        ],
      },
      { text: "性能优化", link: "/optimization/image" },
      { text: "项目配置", link: "/configure/project" },
      { text: "Node", link: "/node/initial" },
      {
        text: "构建工具",
        items: [
          { text: "Vite", link: "bundle/vite/initial" },
          { text: "Webpack", link: "/bundle/webpack/treeShaking" },
        ],
      },
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
            {
              text: "虚拟列表",
              link: "/javascript/application/virtualList",
            },
            {
              text: "文件切片上传",
              link: "/javascript/application/fileSlice",
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
              text: "object",
              link: "/javascript/grammar/object",
            },
            {
              text: "Data Type Detailed Description",
              link: "/javascript/grammar/DescriptionOfDataType",
            },
            {
              text: "module",
              link: "/javascript/grammar/module",
            },
            {
              text: "递归",
              link: "/javascript/grammar/recursion",
            },
            {
              text: "Rest与Spread",
              link: "/javascript/grammar/restSpread",
            },
            {
              text: "闭包",
              link: "/javascript/grammar/closure",
            },
            {
              text: "装饰器和转发",
              link: "/javascript/grammar/decorator",
            },
            {
              text: "来自旧时代的var",
              link: "/javascript/grammar/var",
            },
            {
              text: "深入对象属性",
              link: "/javascript/grammar/deepInObject",
            },
            {
              text: "错误处理",
              link: "/javascript/grammar/trycatch",
            },
            {
              text: "杂项",
              link: "/javascript/grammar/misc",
            },
            {
              text: "冒泡与捕获",
              link: "/javascript/grammar/bubbling",
            },
            {
              text: "词法环境",
              link: "/javascript/grammar/lexicalEnvironment",
            },
            {
              text: "调试",
              link: "/javascript/grammar/devtool",
            },
          ],
        },
      ],
      "/javascript/algorithm": [
        {
          text: "开始",
          link: "/javascript/algorithm",
        },
      ],
      "/rust/": [
        {
          text: "开始",
          link: "/rust/start",
        },
        {
          text: "类型系统",
          link: "/rust/types",
        },
        {
          text: "creat",
          link: "/rust/creat",
        },
        {
          text: "trait",
          link: "/rust/trait",
        },
      ],
      "/bundle/vite": [
        {
          text: "开始",
          link: "/bundle/vite/initial",
        },
        {
          text: "环境变量",
          link: "/bundle/vite/env",
        },
      ],
      "/frame/react/": [
        {
          text: "开始",
          link: "/frame/react/start",
        },
        {
          text: "state",
          link: "/frame/react/state",
        },
        {
          text: "状态管理",
          link: "/frame/react/manage",
        },
      ],
      "/frame/vue/": [
        {
          text: "响应式原理",
          link: "/frame/vue/reactivity",
        },
        {
          text: "api源码",
          link: "/frame/vue/apis",
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
            {
              text: "web work",
              link: "/Web-Api/webWork",
            },
            {
              text: "webAssembly",
              link: "/Web-Api/webAssembly",
            },
            {
              text: "service work",
              link: "/Web-Api/serviceWork",
            },
          ],
        },
      ],
      "/configure/": [
        {
          text: "项目配置",
          items: [
            { text: "检查git commit内容", link: "/configure/project" },
            { text: "难点", link: "/configure/difficult" },
            { text: "要点", link: "/configure/bagu" },
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
      "/vscode/": [
        {
          text: "vscode",
          items: [
            { text: "插件", link: "/vscode/extension" },
            { text: "快捷键", link: "/vscode/keybinding" },
            { text: "视图提供者", link: "/vscode/view" },
          ],
        },
      ],
      "/node/": [
        {
          text: "Node",
          items: [{ text: "概述", link: "/node/initial" }],
        },
      ],
      "/browser/about/": [
        {
          text: "about",
          items: [
            { text: "深入了解现代网络浏览器", link: "/browser/about/overview" },
            { text: "性能指标", link: "/browser/about/performanceTags" },
            { text: "渐进式渲染", link: "/browser/about/progressiveRendering" },
          ],
        },
      ],
      "/browser/http/": [
        {
          text: "http",
          items: [
            { text: "概述", link: "/browser/http/introduct" },
            { text: "跨域", link: "/browser/http/crossorigin" },
            { text: "async defer", link: "/browser/http/async-defer" },
            { text: "http缓存", link: "/browser/http/cache" },
            { text: "安全", link: "/browser/http/secure" },
          ],
        },
      ],
      "/browser/devtool/": [
        {
          text: "devtool",
          items: [
            {
              text: "source",
              link: "/browser/devtool/source",
            },
            {
              text: "network",
              link: "/browser/devtool/network",
            },
            {
              text: "性能监控",
              link: "/browser/devtool/monitor",
            },
          ],
        },
      ],
      "/bundle/webpack/": [
        {
          text: "webpack",
          items: [
            {
              text: "树摇",
              link: "/bundle/webpack/treeShaking",
            },
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
