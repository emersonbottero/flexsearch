## Load Library

There are 3 types of indexes:

1. `Index` is a flat high performance index which stores id-content-pairs.
2. `Worker` / `WorkerIndex` is also a flat index which stores id-content-pairs but runs in background as a dedicated worker thread.
3. `Document` is multi-field index which can store complex JSON documents (could also exist of worker indexes).

The most of you probably need just one of them according to your scenario.

### ES6 Modules (Browser):

```js
import Index from "./index.js";
import Document from "./document.js";
import WorkerIndex from "./worker/index.js";

const index = new Index(options);
const document = new Document(options);
const worker = new WorkerIndex(options);
```

### Bundle (Browser)

```html
<html>
  <head>
    <script src="js/flexsearch.bundle.js"></script>
  </head>
  ...
</html>
```

Or via CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.7.31/dist/flexsearch.bundle.js"></script>
```

AMD:

```javascript
var FlexSearch = require("./flexsearch.js");
```

Load one of the builds from the folder <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.31/dist">dist</a> within your html as a script and use as follows:

```js
var index = new FlexSearch.Index(options);
var document = new FlexSearch.Document(options);
var worker = new FlexSearch.Worker(options);
```

### Node.js

```cmd
npm install flexsearch
```

In your code include as follows:

```js
const { Index, Document, Worker } = require("flexsearch");

const index = new Index(options);
const document = new Document(options);
const worker = new Worker(options);
```

## Basic Usage and Variants

```js
index.add(id, text);
index.search(text);
index.search(text, limit);
index.search(text, options);
index.search(text, limit, options);
index.search(options);
```

```js
document.add(doc);
document.add(id, doc);
document.search(text);
document.search(text, limit);
document.search(text, options);
document.search(text, limit, options);
document.search(options);
```

```js
worker.add(id, text);
worker.search(text);
worker.search(text, limit);
worker.search(text, options);
worker.search(text, limit, options);
worker.search(text, limit, options, callback);
worker.search(options);
```

The `worker` inherits from type `Index` and does not inherit from type `Document`. Therefore, a WorkerIndex basically works like a standard FlexSearch Index. Worker-Support in documents needs to be enabled by just passing the appropriate option during creation `{ worker: true }`.

::: warning
Every method called on a `Worker` index is treated as async. You will get back a `Promise` or you can provide a callback function as the last parameter alternatively.
:::

## Async

You can call each method in its async version, e.g. `index.addAsync` or `index.searchAsync`.

You can assign callbacks to each async function:

```js
index.addAsync(id, content, function () {
  console.log("Task Done");
});

index.searchAsync(query, function (result) {
  console.log("Results: ", result);
});
```

Or do not pass a callback function and getting back a `Promise` instead:

```js
index.addAsync(id, content).then(function () {
  console.log("Task Done");
});

index.searchAsync(query).then(function (result) {
  console.log("Results: ", result);
});
```

Or use `async` and `await`:

```js
async function add() {
  await index.addAsync(id, content);
  console.log("Task Done");
}

async function search() {
  const results = await index.searchAsync(query);
  console.log("Results: ", result);
}
```

## Presets

1. `memory` (primary optimize for memory)
2. `performance` (primary optimize for performance)
3. `match` (primary optimize for matching)
4. `score` (primary optimize for scoring)
5. `default` (the default balanced profile)

These profiles are covering standard use cases. It is recommended to apply custom configuration instead of using profiles to get the best out for your situation. Every profile could be optimized further to its specific task, e.g. extreme performance optimized configuration or extreme memory and so on.

You can pass a preset during creation/initialization of the index.

<!--
Compare these presets:
- <a href="https://raw.githack.com/nextapps-de/flexsearch/master/test/matching-presets.html" target="_blank">Relevance Scoring</a><br>
- <a href="https://raw.githack.com/nextapps-de/flexsearch/master/test/benchmark-presets.html" target="_blank">Benchmarks</a>
-->


## API Overview

Global methods:

- <a href="#flexsearch.register">FlexSearch.**registerCharset**(name, charset)</a>
- <a href="#flexsearch.language">FlexSearch.**registerLanguage**(name, language)</a>

Index methods:

- <a href="#index.add">Index.**add**(id, string)</a> \*
- <a href="#index.append">Index.**append**(id, string)</a> \*
- <a href="#index.update">Index.**update**(id, string)</a> \*
- <a href="#index.remove">Index.**remove**(id)</a> \*
- <a href="#index.search">Index.**search**(string, \<limit\>, \<options\>)</a> \*
- <a href="#index.search">Index.**search**(options)</a> \*
- _async_ <a href="#index.export">Index.**export**(handler)</a>
- _async_ <a href="#index.import">Index.**import**(key, data)</a>

WorkerIndex methods:

- _async_ <a href="#index.add">Index.**add**(id, string)</a>
- _async_ <a href="#index.append">Index.**append**(id, string)</a>
- _async_ <a href="#index.update">Index.**update**(id, string)</a>
- _async_ <a href="#index.remove">Index.**remove**(id)</a>
- _async_ <a href="#index.search">Index.**search**(string, \<limit\>, \<options\>)</a>
- _async_ <a href="#index.search">Index.**search**(options)</a>
- _async_ <a href="#index.export">~~Index.**export**(handler)~~</a> (WIP)
- _async_ <a href="#index.import">~~Index.**import**(key, data)~~</a> (WIP)

Document methods:

- <a href="#document.add">Document.**add**(\<id\>, document)</a> \*
- <a href="#document.append">Document.**append**(\<id\>, document)</a> \*
- <a href="#document.update">Document.**update**(\<id\>, document)</a> \*
- <a href="#document.remove">Document.**remove**(id || document)</a> \*
- <a href="#document.search">Document.**search**(string, \<limit\>, \<options\>)</a> \*
- <a href="#document.search">Document.**search**(options)</a> \*
- _async_ <a href="#document.export">Document.**export**(handler)</a>
- _async_ <a href="#document.import">Document.**import**(key, data)</a>

<span>\*</span> For each of those methods there exist an asynchronous equivalent:

Async Version:

- _async_ <a href="#addAsync">.**addAsync**( ... , \<callback\>)</a>
- _async_ <a href="#appendAsync">.**appendAsync**( ... , \<callback\>)</a>
- _async_ <a href="#updateAsync">.**updateAsync**( ... , \<callback\>)</a>
- _async_ <a href="#removeAsync">.**removeAsync**( ... , \<callback\>)</a>
- _async_ <a href="#searchAsync">.**searchAsync**( ... , \<callback\>)</a>

Async methods will return a `Promise`, alternatively you can pass a callback function as the last parameter.

Methods `export` and also `import` are always async as well as every method you call on a Worker-based Index.
