## Worker Parallelism (Browser + Node.js)

The new worker model from v0.7.0 is divided into "fields" from the document (1 worker = 1 field index). This way the worker becomes able to solve tasks (subtasks) completely. The downside of this paradigm is they might not have been perfect balanced in storing contents (fields may have different length of contents). On the other hand there is no indication that balancing the storage gives any advantage (they all require the same amount in total).

When using a document index, then just apply the option "worker":

```js
const index = new Document({
  index: ["tag", "name", "title", "text"],
  worker: true,
});

index
  .add({
    id: 1,
    tag: "cat",
    name: "Tom",
    title: "some",
    text: "some",
  })
  .add({
    id: 2,
    tag: "dog",
    name: "Ben",
    title: "title",
    text: "content",
  })
  .add({
    id: 3,
    tag: "cat",
    name: "Max",
    title: "to",
    text: "to",
  })
  .add({
    id: 4,
    tag: "dog",
    name: "Tim",
    title: "index",
    text: "index",
  });
```

```
Worker 1: { 1: "cat", 2: "dog", 3: "cat", 4: "dog" }
Worker 2: { 1: "Tom", 2: "Ben", 3: "Max", 4: "Tim" }
Worker 3: { 1: "some", 2: "title", 3: "to", 4: "index" }
Worker 4: { 1: "some", 2: "content", 3: "to", 4: "index" }
```

When you perform a field search through all fields then this task is being balanced perfectly through all workers, which can solve their subtasks independently.

## Worker Index

Above we have seen that documents will create worker automatically for each field. You can also create a WorkerIndex directly (same like using `Index` instead of `Document`).

Use as ES6 module:

```js
import WorkerIndex from "./worker/index.js";
const index = new WorkerIndex(options);
index.add(1, "some").add(2, "content").add(3, "to").add(4, "index");
```

Or when bundled version was used instead:

```js
var index = new FlexSearch.Worker(options);
index.add(1, "some").add(2, "content").add(3, "to").add(4, "index");
```

Such a WorkerIndex works pretty much the same as a created instance of `Index`.

> A WorkerIndex only support the `async` variant of all methods. That means when you call `index.search()` on a WorkerIndex this will perform also in async the same way as `index.searchAsync()` will do.

## Worker Threads (Node.js)

The worker model for Node.js is based on "worker threads" and works exactly the same way:

```js
const { Document } = require("flexsearch");

const index = new Document({
  index: ["tag", "name", "title", "text"],
  worker: true,
});
```

Or create a single worker instance for a non-document index:

```js
const { Worker } = require("flexsearch");
const index = new Worker({ options });
```

## The Worker Async Model (Best Practices)

A worker will always perform as async. On a query method call you always should handle the returned promise (e.g. use `await`) or pass a callback function as the last parameter.

```js
const index = new Document({
  index: ["tag", "name", "title", "text"],
  worker: true,
});
```

All requests and sub-tasks will run in parallel (prioritize "all tasks completed"):

```js
index.searchAsync(query, callback);
index.searchAsync(query, callback);
index.searchAsync(query, callback);
```

Also (prioritize "all tasks completed"):

```js
index.searchAsync(query).then(callback);
index.searchAsync(query).then(callback);
index.searchAsync(query).then(callback);
```

Or when you have just one callback when all requests are done, simply use `Promise.all()` which also prioritize "all tasks completed":

```js
Promise.all([
  index.searchAsync(query),
  index.searchAsync(query),
  index.searchAsync(query),
]).then(callback);
```

Inside the callback of `Promise.all()` you will also get an array of results as the first parameter respectively for each query you put into.

When using `await` you can prioritize the order (prioritize "first task completed") and solve requests one by one and just process the sub-tasks in parallel:

```js
await index.searchAsync(query);
await index.searchAsync(query);
await index.searchAsync(query);
```

Same for `index.add()`, `index.append()`, `index.remove()` or `index.update()`. Here there is a special case which isn't disabled by the library, but you need to keep in mind when using Workers.

When you call the "synced" version on a worker index:

```js
index.add(doc);
index.add(doc);
index.add(doc);
// contents aren't indexed yet,
// they just queued on the message channel
```

Of course, you can do that but keep in mind that the main thread does not have an additional queue for distributed worker tasks. Running these in a long loop fires content massively to the message channel via `worker.postMessage()` internally. Luckily the browser and Node.js will handle such incoming tasks for you automatically (as long enough free RAM is available). When using the "synced" version on a worker index, the content isn't indexed one line below, because all calls are treated as async by default.

> When adding/updating/removing large bulks of content to the index (or high frequency), it is recommended to use the async version along with `async/await` to keep a low memory footprint during long processes.
