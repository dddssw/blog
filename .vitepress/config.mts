import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "dddssw'blog",
  description: "A VitePress Site",
  lastUpdated: true,
  base: "/blog/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/images.jfif",
    search: {
      provider: "local",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
      { text: "Web-Api", link: "/Web-Api/ResizeObserver" },
      {
        text: "Dropdown Menu",
        items: [
          { text: "Item A", link: "/item-1" },
          { text: "Item B", link: "/item-2" },
          { text: "Item C", link: "/item-3" },
        ],
      },
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
      "/Web-Api/": [
        {
          text: "Web-Api",
          // collapsed: true,
          items: [
            { text: "ResizeObserver", link: "/Web-Api/ResizeObserver" },
            { text: "Web Storage API", link: "/Web-Api/StorageAPI" },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/dddssw" }],
  },
});
