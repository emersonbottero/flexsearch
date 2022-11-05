## Create a new index

```js
var index = new Index();
```

Create a new index and choosing one of the presets:

```js
var index = new Index("performance");
```

Create a new index with custom options:

```js
var index = new Index({
  charset: "latin:extra",
  tokenize: "reverse",
  resolution: 9,
});
```

Create a new index and extend a preset with custom options:

```js
var index = new FlexSearch({
  preset: "memory",
  tokenize: "forward",
  resolution: 5,
});
```

<a href="#options">See all available custom options.</a>

<a name="index.add"></a>

## Add text item to an index

Every content which should be added to the index needs an ID. When your content has no ID, then you need to create one by passing an index or count or something else as an ID (a value from type `number` is highly recommended). Those IDs are unique references to a given content. This is important when you update or adding over content through existing IDs. When referencing is not a concern, you can simply use something simple like `count++`.

> Index.**add(id, string)**

```js
index.add(0, "John Doe");
```

## Search items

> Index.**search(string | options, \<limit\>, \<options\>)**

```js
index.search("John");
```

Limit the result:

```js
index.search("John", 10);
```

## Check existence of already indexed IDs

You can check if an ID was already indexed by:

```js
if (index.contain(1)) {
  console.log("ID is already in index");
}
```
