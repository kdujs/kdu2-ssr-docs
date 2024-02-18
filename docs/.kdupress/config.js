module.exports = {
  locales: {
    "/": {
      lang: "en-US",
      title: "Kdu SSR Guide",
      description: "Kdu.js Server-Side Rendering Guide",
    },
  },
  // serviceWorker: true,
  // theme: 'kdu',
  themeConfig: {
    repo: "kdujs/kdu2-ssr-docs",
    docsDir: "docs",
    locales: {
      "/": {
        label: "English",
        selectText: "Languages",
        editLinkText: "Edit this page on GitHub",
        nav: [
          {
            text: "Guide",
            link: "/guide/",
          },
          {
            text: "API Reference",
            link: "/api/",
          },
        ],
        sidebar: [
          ["/", "Introduction"],
          "/guide/",
          "/guide/universal",
          "/guide/structure",
          "/guide/routing",
          "/guide/data",
          "/guide/hydration",
          "/guide/bundle-renderer",
          "/guide/build-config",
          "/guide/css",
          "/guide/head",
          "/guide/caching",
          "/guide/streaming",
          "/guide/non-node",
        ],
      },
    },
  },
};
