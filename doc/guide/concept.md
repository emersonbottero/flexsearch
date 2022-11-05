## FlexSearch v0.7.0

The new version is finally available. FlexSearch v0.7.0 is a modern re-implementation and was newly developed from the ground up. The result is an improvement in every single aspect and covers tons of enhancements and improvements which was collected over the last 3 years.

This new version has a good compatibility with the old generation, but it might require some migrations steps in your code.

Read the documentation of new features and changes:<br>
<a href="https://github.com/nextapps-de/flexsearch/blob/master/doc/0.7.0.md">https://github.com/nextapps-de/flexsearch/blob/master/doc/0.7.0.md</a>

Read the documentation of new language encoding features:<br>
<a href="https://github.com/nextapps-de/flexsearch/blob/master/doc/0.7.0-lang.md">https://github.com/nextapps-de/flexsearch/blob/master/doc/0.7.0-lang.md</a>

When it comes to raw search speed <a href="https://nextapps-de.github.io/flexsearch/bench/" target="_blank">FlexSearch outperforms every single searching library out there</a> and also provides flexible search capabilities like multi-field search, phonetic transformations or partial matching.

Depending on the used <a href="#options">options</a> it also provides the <a href="#memory">most memory-efficient index</a>. FlexSearch introduce a new scoring algorithm called <a href="#contextual">"contextual index"</a> based on a <a href="#dictionary">pre-scored lexical dictionary</a> architecture which actually performs queries up to 1,000,000 times faster compared to other libraries.
FlexSearch also provides you a non-blocking asynchronous processing model as well as web workers to perform any updates or queries on the index in parallel through dedicated balanced threads.

Supported Platforms:

- Browser
- Node.js

Library Comparison "Gulliver's Travels":

- <a href="https://nextapps-de.github.io/flexsearch/bench/" target="_blank">Performance Benchmark</a>
- <a href="https://nextapps-de.github.io/flexsearch/bench/match.html" target="_blank">Scoring Benchmark</a>
- <a href="#consumption">Memory Consumption</a>

Plugins (extern projects):

- [React](https://github.com/angeloashmore/react-use-flexsearch)
- [Gatsby](https://www.gatsbyjs.org/packages/gatsby-plugin-flexsearch/)

## Get Latest Stable Build (Recommended)

| Build                 | File     | CDN                                                                                 |
| --------------------- | -------- | ----------------------------------------------------------------------------------- |
| flexsearch.bundle.js  | Download | https://rawcdn.githack.com/nextapps-de/flexsearch/0.7.31/dist/flexsearch.bundle.js  |
| flexsearch.light.js   | Download | https://rawcdn.githack.com/nextapps-de/flexsearch/0.7.31/dist/flexsearch.light.js   |
| flexsearch.compact.js | Download | https://rawcdn.githack.com/nextapps-de/flexsearch/0.7.31/dist/flexsearch.compact.js |
| flexsearch.es5.js \*  | Download | https://rawcdn.githack.com/nextapps-de/flexsearch/0.7.31/dist/flexsearch.es5.js     |
| ES6 Modules           | Download | The /dist/module/ folder of this Github repository                                  |

<span>\*</span> The bundle "flexsearch.es5.js" includes polyfills for EcmaScript 5 Support.

### Get Latest (NPM)

```cmd
npm install flexsearch
```

### Get Latest Nightly (Do not use for production!)

Just exchange the version number from the URLs above with "master", e.g.: "/flexsearch/**0.7.31**/dist/" into "/flexsearch/**master**/dist".

### Compare Web-Bundles

> The Node.js package includes all features from `flexsearch.bundle.js`.

| Feature                                                                                  | flexsearch.bundle.js | flexsearch.compact.js | flexsearch.light.js |
| ---------------------------------------------------------------------------------------- | -------------------- | --------------------- | ------------------- |
| Presets                                                                                  | ✓                    | ✓                     | -                   |
| Async Search                                                                             | ✓                    | ✓                     | -                   |
| Workers (Web + Node.js)                                                                  | ✓                    | -                     | -                   |
| Contextual Indexes                                                                       | ✓                    | ✓                     | ✓                   |
| Index Documents (Field-Search)                                                           | ✓                    | ✓                     | -                   |
| Document Store                                                                           | ✓                    | ✓                     | -                   |
| Partial Matching                                                                         | ✓                    | ✓                     | ✓                   |
| Relevance Scoring                                                                        | ✓                    | ✓                     | ✓                   |
| Auto-Balanced Cache by Popularity                                                        | ✓                    | -                     | -                   |
| Tags                                                                                     | ✓                    | -                     | -                   |
| Suggestions                                                                              | ✓                    | ✓                     | -                   |
| Phonetic Matching                                                                        | ✓                    | ✓                     | -                   |
| Customizable Charset/Language (Matcher, Encoder, Tokenizer, Stemmer, Filter, Split, RTL) | ✓                    | ✓                     | ✓                   |
| Export / Import Indexes                                                                  | ✓                    | -                     | -                   |
| File Size (gzip)                                                                         | 6.8 kb               | 5.3 kb                | 2.9 kb              |

## Performance Benchmark (Ranking)

Run Comparison: <a href="https://nextapps-de.github.io/flexsearch/bench/" target="_blank">Performance Benchmark "Gulliver's Travels"</a>

Operation per seconds, higher is better, except the test "Memory" on which lower is better.

| Rank | Library        | Memory  | Query (Single Term) | Query (Multi Term) | Query (Long) | Query (Dupes) | Query (Not Found) |
| ---- | -------------- | ------- | ------------------- | ------------------ | ------------ | ------------- | ----------------- |
| 1    | FlexSearch     | 17      | 7084129             | 1586856            | 511585       | 2017142       | 3202006           |
| 2    | JSii           | 27      | 6564                | 158149             | 61290        | 95098         | 534109            |
| 3    | Wade           | 424     | 20471               | 78780              | 16693        | 225824        | 213754            |
| 4    | JS Search      | 193     | 8221                | 64034              | 10377        | 95830         | 167605            |
| 5    | Elasticlunr.js | 646     | 5412                | 7573               | 2865         | 23786         | 13982             |
| 6    | BulkSearch     | 1021    | 3069                | 3141               | 3333         | 3265          | 21825569          |
| 7    | MiniSearch     | 24348   | 4406                | 10945              | 72           | 39989         | 17624             |
| 8    | bm25           | 15719   | 1429                | 789                | 366          | 884           | 1823              |
| 9    | Lunr.js        | 2219    | 255                 | 271                | 272          | 266           | 267               |
| 10   | FuzzySearch    | 157373  | 53                  | 38                 | 15           | 32            | 43                |
| 11   | Fuse           | 7641904 | 6                   | 2                  | 1            | 2             | 3                 |

<a name="contextual"></a>

## Contextual Search

::: info Note
This feature is disabled by default because of its extended memory usage. Read <a href="#contextual_enable">here</a>to get more information about and how to enable.
:::

FlexSearch introduce a new scoring mechanism called **Contextual Search** which was invented by <a href="https://github.com/ts-thomas" target="_blank">Thomas Wilkerling</a>, the author of this library. A Contextual Search <a href="https://nextapps-de.github.io/flexsearch/bench/" target="_blank">incredibly boost up queries to a complete new level</a> but also requires some additional memory (depending on **_depth_**).
The basic idea of this concept is to limit relevance by its context instead of calculating relevance through the whole distance of its corresponding document.
This way contextual search also <a href="https://nextapps-de.github.io/flexsearch/bench/match.html" target="_blank">improves the results of relevance-based queries</a> on a large amount of text data.

![](https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/doc/contextual-index.svg?v=4)

<span style="display: flex; gap: 1rem;">
<a target="_blank" href="https://www.npmjs.com/package/flexsearch"><img src="https://img.shields.io/npm/v/flexsearch.svg"></a> <a target="_blank" href="https://github.com/nextapps-de/flexsearch/blob/master/LICENSE.md"><img src="https://img.shields.io/npm/l/flexsearch.svg"></a>

<!--<a target="_blank" href="https://travis-ci.org/nextapps-de/flexsearch"><img src="https://travis-ci.org/nextapps-de/flexsearch.svg?branch=master"></a>-->
<!--<a target="_blank" href="https://coveralls.io/github/nextapps-de/flexsearch?branch=master"><img src="https://coveralls.io/repos/github/nextapps-de/flexsearch/badge.svg?branch=master&v=0"></a>-->
</span>
