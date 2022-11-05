## Use numeric IDs

It is recommended to use numeric id values as reference when adding content to the index. The byte length of passed ids influences the memory consumption significantly. If this is not possible you should consider to use a index table and map the ids with indexes, this becomes important especially when using contextual indexes on a large amount of content.

## Split Complexity

Whenever you can, try to divide content by categories and add them to its own index, e.g.:

```js
var action = new FlexSearch();
var adventure = new FlexSearch();
var comedy = new FlexSearch();
```

This way you can also provide different settings for each category. This is actually the fastest way to perform a fuzzy search.

To make this workaround more extendable you can use a short helper:

```js
var index = {};

function add(id, cat, content) {
  (index[cat] || (index[cat] = new FlexSearch())).add(id, content);
}

function search(cat, query) {
  return index[cat] ? index[cat].search(query) : [];
}
```

Add content to the index:

```js
add(1, "action", "Movie Title");
add(2, "adventure", "Movie Title");
add(3, "comedy", "Movie Title");
```

Perform queries:

```js
var results = search("action", "movie title"); // --> [1]
```

Split indexes by categories improves performance significantly.