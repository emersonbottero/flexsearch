import { version } from "../../package.json";

export default {
  title: " ",
  themeConfig: {
    logo: "/flexsearch-logo-glass.svg",
    base: "/flexsearch/",
    nav: [
      { text: "Guide", link: "/guide/concept", activeMatch: "/guide/" },
      { text: "Api", link: "/api/", activeMatch: "/api/" },
      {
        text: version,
        items: [
          {
            text: "Changelog",
            link: "https://github.com/nextapps-de/flexsearch/blob/master/CHANGELOG.md",
          },
          {
            text: "Contributing",
            link: "https://github.com/nextapps-de/flexsearch/blob/master/contributing.md",
          },
        ],
      },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [{ text: "Concept", link: "/guide/concept" }],
        },
      ],

      "/api/": [
        {
          text: "API",
          items: [
            { text: "Overview", link: "/api/" },
            { text: "Best Practice", link: "/api/best-practice" },
            { text: "Contextual Scoring", link: "/api/contextual-scoring" },
            { text: "document", link: "/api/document" },
            { text: "Edit Index", link: "/api/edit-index" },
            { text: "Encoder", link: "/api/encoder" },
            { text: "Export/Import", link: "/api/export-import" },
            { text: "Language", link: "/api/language" },
            { text: "Memory Allocation", link: "/api/memory" },
            { text: "Options", link: "/api/options" },
            { text: "Tokenizer", link: "/api/tokenizer" },
            { text: "Usage", link: "/api/usage" },
            { text: "Worker Parallelism", link: "/api/worker-parallelism" },
          ],
        },
      ],
    },
    footer: {
      message:
        ' Released under the <a href="http://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Apache 2.0 License</a>',
      copyright: "Copyright ©2018-Present Nextapps GmbH",
    },
  },
};
