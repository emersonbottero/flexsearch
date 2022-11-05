## Enable Contextual Scoring

Create an index and use the default context:

```js
var index = new FlexSearch({
  tokenize: "strict",
  context: true,
});
```

Create an index and apply custom options for the context:

```js
var index = new FlexSearch({
  tokenize: "strict",
  context: {
    resolution: 5,
    depth: 3,
    bidirectional: true,
  },
});
```

> Only the tokenizer "strict" is actually supported by the contextual index.

> The contextual index requires <a href="#memory">additional amount of memory</a> depending on depth.

## Auto-Balanced Cache (By Popularity)

You need to initialize the cache and its limit during the creation of the index:

```js
const index = new Index({ cache: 100 });
```

```js
const results = index.searchCache(query);
```

A common scenario for using a cache is an autocomplete or instant search when typing.

> When passing a number as a limit the cache automatically balance stored entries related to their popularity.

> When just using "true" the cache is unbounded and perform actually 2-3 times faster (because the balancer do not have to run).

<a name="webworker"></a>
