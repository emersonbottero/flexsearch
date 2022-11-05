## Index Documents (Field-Search)

### The Document Descriptor

Assuming our document has a data structure like this:

```json
{
  "id": 0,
  "content": "some text"
}
```

Old syntax FlexSearch v0.6.3 (**_not supported anymore!_**):

```js
const index = new Document({
  doc: {
    id: "id",
    field: ["content"],
  },
});
```

> The document descriptor has slightly changed, there is no `field` branch anymore, instead just apply one level higher, so `key` becomes a main member of options.

For the new syntax the field "doc" was renamed to `document` and the field "field" was renamed to `index`:

```js
const index = new Document({
  document: {
    id: "id",
    index: ["content"],
  },
});

index.add({
  id: 0,
  content: "some text",
});
```

The field `id` describes where the ID or unique key lives inside your documents. The default key gets the value `id` by default when not passed, so you can shorten the example from above to:

```js
const index = new Document({
  document: {
    index: ["content"],
  },
});
```

The member `index` has a list of fields which you want to be indexed from your documents. When just selecting one field, then you can pass a string. When also using default key `id` then this shortens to just:

```js
const index = new Document({ document: "content" });
index.add({ id: 0, content: "some text" });
```

Assuming you have several fields, you can add multiple fields to the index:

```js
var docs = [
  {
    id: 0,
    title: "Title A",
    content: "Body A",
  },
  {
    id: 1,
    title: "Title B",
    content: "Body B",
  },
];
```

```js
const index = new Document({
  id: "id",
  index: ["title", "content"],
});
```

You can pass custom options for each field:

```js
const index = new Document({
  id: "id",
  index: [
    {
      field: "title",
      tokenize: "forward",
      optimize: true,
      resolution: 9,
    },
    {
      field: "content",
      tokenize: "strict",
      optimize: true,
      resolution: 5,
      minlength: 3,
      context: {
        depth: 1,
        resolution: 3,
      },
    },
  ],
});
```

Field options gets inherited when also global options was passed, e.g.:

```js
const index = new Document({
  tokenize: "strict",
  optimize: true,
  resolution: 9,
  document: {
    id: "id",
    index: [
      {
        field: "title",
        tokenize: "forward",
      },
      {
        field: "content",
        minlength: 3,
        context: {
          depth: 1,
          resolution: 3,
        },
      },
    ],
  },
});
```

Note: The context options from the field "content" also gets inherited by the corresponding field options, whereas this field options was inherited by the global option.

### Nested Data Fields (Complex Objects)

Assume the document array looks more complex (has nested branches etc.), e.g.:

```json
{
  "record": {
    "id": 0,
    "title": "some title",
    "content": {
      "header": "some text",
      "footer": "some text"
    }
  }
}
```

Then use the colon separated notation `root:child:child` to define hierarchy within the document descriptor:

```js
const index = new Document({
  document: {
    id: "record:id",
    index: ["record:title", "record:content:header", "record:content:footer"],
  },
});
```

> Just add fields you want to query against. Do not add fields to the index, you just need in the result (but did not query against). For this purpose you can store documents independently of its index (read below).

When you want to query through a field you have to pass the exact key of the field you have defined in the `doc` as a field name (with colon syntax):

```js
index.search(query, {
  index: ["record:title", "record:content:header", "record:content:footer"],
});
```

Same as:

```js
index.search(query, [
  "record:title",
  "record:content:header",
  "record:content:footer",
]);
```

Using field-specific options:

```js
index.search([
  {
    field: "record:title",
    query: "some query",
    limit: 100,
    suggest: true,
  },
  {
    field: "record:title",
    query: "some other query",
    limit: 100,
    suggest: true,
  },
]);
```

You can perform a search through the same field with different queries.

> When passing field-specific options you need to provide the full configuration for each field. They get not inherited like the document descriptor.

### Complex Documents

You need to follow 2 rules for your documents:

1. The document cannot start with an Array at the root index. This will introduce sequential data and isn't supported yet. See below for a workaround for such data.

```js
[
  // <-- not allowed as document start!
  {
    id: 0,
    title: "title",
  },
];
```

2. The id can't be nested inside an array (also none of the parent fields can't be an array). This will introduce sequential data and isn't supported yet. See below for a workaround for such data.

```js
{
  "records": [ // <-- not allowed when ID or tag lives inside!
    {
      "id": 0,
      "title": "title"
    }
  ]
}
```

Here an example for a supported complex document:

```json
{
  "meta": {
    "tag": "cat",
    "id": 0
  },
  "contents": [
    {
      "body": {
        "title": "some title",
        "footer": "some text"
      },
      "keywords": ["some", "key", "words"]
    },
    {
      "body": {
        "title": "some title",
        "footer": "some text"
      },
      "keywords": ["some", "key", "words"]
    }
  ]
}
```

The corresponding document descriptor (when all fields should be indexed) looks like:

```js
const index = new Document({
  document: {
    id: "meta:id",
    tag: "meta:tag",
    index: [
      "contents[]:body:title",
      "contents[]:body:footer",
      "contents[]:keywords",
    ],
  },
});
```

Again, when searching you have to use the same colon-separated-string from your field definition.

```js
index.search(query, {
  index: "contents[]:body:title",
});
```

### Not Supported Documents (Sequential Data)

This example breaks both rules from above:

```js
[
  // <-- not allowed as document start!
  {
    tag: "cat",
    records: [
      // <-- not allowed when ID or tag lives inside!
      {
        id: 0,
        body: {
          title: "some title",
          footer: "some text",
        },
        keywords: ["some", "key", "words"],
      },
      {
        id: 1,
        body: {
          title: "some title",
          footer: "some text",
        },
        keywords: ["some", "key", "words"],
      },
    ],
  },
];
```

You need to apply some kind of structure normalization.

A workaround to such a data structure looks like this:

```js
const index = new Document({
  document: {
    id: "record:id",
    tag: "tag",
    index: ["record:body:title", "record:body:footer", "record:body:keywords"],
  },
});

function add(sequential_data) {
  for (let x = 0, data; x < sequential_data.length; x++) {
    data = sequential_data[x];

    for (let y = 0, record; y < data.records.length; y++) {
      record = data.records[y];

      index.add({
        id: record.id,
        tag: data.tag,
        record: record,
      });
    }
  }
}

// now just use add() helper method as usual:

add([
  {
    // sequential structured data
    // take the data example above
  },
]);
```

You can skip the first loop when your document data has just one index as the outer array.

### Add/Update/Remove Documents to/from the Index

Just pass the document array (or a single object) to the index:

```js
index.add(docs);
```

Update index with a single object or an array of objects:

```js
index.update({
  data: {
    id: 0,
    title: "Foo",
    body: {
      content: "Bar",
    },
  },
});
```

Remove a single object or an array of objects from the index:

```js
index.remove(docs);
```

When the id is known, you can also simply remove by (faster):

```js
index.remove(id);
```

### Join / Append Arrays

On the complex example above, the field `keywords` is an array but here the markup did not have brackets like `keywords[]`. That will also detect the array but instead of appending each entry to a new context, the array will be joined into on large string and added to the index.

The difference of both kinds of adding array contents is the relevance when searching. When adding each item of an array via `append()` to its own context by using the syntax `field[]`, then the relevance of the last entry concurrent with the first entry. When you left the brackets in the notation, it will join the array to one whitespace-separated string. Here the first entry has the highest relevance, whereas the last entry has the lowest relevance.

So assuming the keyword from the example above are pre-sorted by relevance to its popularity, then you want to keep this order (information of relevance). For this purpose do not add brackets to the notation. Otherwise, it would take the entries in a new scoring context (the old order is getting lost).

Also you can left bracket notation for better performance and smaller memory footprint. Use it when you did not need the granularity of relevance by the entries.

### Field-Search

Search through all fields:

```js
index.search(query);
```

Search through a specific field:

```js
index.search(query, { index: "title" });
```

Search through a given set of fields:

```js
index.search(query, { index: ["title", "content"] });
```

Same as:

```js
index.search(query, ["title", "content"]);
```

Pass custom modifiers and queries to each field:

```js
index.search([
  {
    field: "content",
    query: "some query",
    limit: 100,
    suggest: true,
  },
  {
    field: "content",
    query: "some other query",
    limit: 100,
    suggest: true,
  },
]);
```

You can perform a search through the same field with different queries.

<a href="#options-field-search">See all available field-search options.</a>

### The Result Set

Schema of the result-set:

> `fields[] => { field, result[] => { document }}`

The first index is an array of fields the query was applied to. Each of this field has a record (object) with 2 properties "field" and "result". The "result" is also an array and includes the result for this specific field. The result could be an array of IDs or as enriched with stored document data.

A non-enriched result set now looks like:

```js
[
  {
    field: "title",
    result: [0, 1, 2],
  },
  {
    field: "content",
    result: [3, 4, 5],
  },
];
```

An enriched result set now looks like:

```js
[
  {
    field: "title",
    result: [
      {
        id: 0,
        doc: {
          /* document */
        },
      },
      {
        id: 1,
        doc: {
          /* document */
        },
      },
      {
        id: 2,
        doc: {
          /* document */
        },
      },
    ],
  },
  {
    field: "content",
    result: [
      {
        id: 3,
        doc: {
          /* document */
        },
      },
      {
        id: 4,
        doc: {
          /* document */
        },
      },
      {
        id: 5,
        doc: {
          /* document */
        },
      },
    ],
  },
];
```

When using `pluck` instead of "field" you can explicitly select just one field and get back a flat representation:

```js
index.search(query, { pluck: "title", enrich: true });
```

```js
[
  {
    id: 0,
    doc: {
      /* document */
    },
  },
  {
    id: 1,
    doc: {
      /* document */
    },
  },
  {
    id: 2,
    doc: {
      /* document */
    },
  },
];
```

This result set is a replacement of "boolean search". Instead of applying your bool logic to a nested object, you can apply your logic by yourself on top of the result-set dynamically. This opens hugely capabilities on how you process the results. Therefore, the results from the fields aren't squashed into one result anymore. That keeps some important information, like the name of the field as well as the relevance of each field results which didn't get mixed anymore.

> A field search will apply a query with the boolean "or" logic by default. Each field has its own result to the given query.

There is one situation where the `bool` property is being still supported. When you like to switch the default "or" logic from the field search into "and", e.g.:

```js
index.search(query, {
  index: ["title", "content"],
  bool: "and",
});
```

You will just get results which contains the query in both fields. That's it.

### Tags

Like the `key` for the ID just define the path to the tag:

```js
const index = new Document({
  document: {
    id: "id",
    tag: "tag",
    index: "content",
  },
});
```

```js
index.add({
  id: 0,
  tag: "cat",
  content: "Some content ...",
});
```

Your data also can have multiple tags as an array:

```js
index.add({
  id: 1,
  tag: ["animal", "dog"],
  content: "Some content ...",
});
```

You can perform a tag-specific search by:

```js
index.search(query, {
  index: "content",
  tag: "animal",
});
```

This just gives you result which was tagged with the given tag.

Use multiple tags when searching:

```js
index.search(query, {
  index: "content",
  tag: ["cat", "dog"],
});
```

This gives you result which are tagged with one of the given tag.

> Multiple tags will apply as the boolean "or" by default. It just needs one of the tags to be existing.

This is another situation where the `bool` property is still supported. When you like to switch the default "or" logic from the tag search into "and", e.g.:

```js
index.search(query, {
  index: "content",
  tag: ["dog", "animal"],
  bool: "and",
});
```

You will just get results which contains both tags (in this example there is just one records which has the tag "dog" and "animal").

### Tag Search

You can also fetch results from one or more tags when no query was passed:

```js
index.search({ tag: ["cat", "dog"] });
```

In this case the result-set looks like:

```js
[
  {
    tag: "cat",
    result: [
      /* all cats */
    ],
  },
  {
    tag: "dog",
    result: [
      /* all dogs */
    ],
  },
];
```

### Limit & Offset

> By default, every query is limited to 100 entries. Unbounded queries leads into issues. You need to set the limit as an option to adjust the size.

You can set the limit and the offset for each query:

```js
index.search(query, { limit: 20, offset: 100 });
```

> You cannot pre-count the size of the result-set. That's a limit by the design of FlexSearch. When you really need a count of all results you are able to page through, then just assign a high enough limit and get back all results and apply your paging offset manually (this works also on server-side). FlexSearch is fast enough that this isn't an issue.

## Document Store

Only a document index can have a store. You can use a document index instead of a flat index to get this functionality also when only storing ID-content-pairs.

You can define independently which fields should be indexed and which fields should be stored. This way you can index fields which should not be included in the search result.

> Do not use a store when: 1. an array of IDs as the result is good enough, or 2. you already have the contents/documents stored elsewhere (outside the index).

> When the `store` attribute was set, you have to include all fields which should be stored explicitly (acts like a whitelist).

> When the `store` attribute was not set, the original document is stored as a fallback.

This will add the whole original content to the store:

```js
const index = new Document({
  document: {
    index: "content",
    store: true,
  },
});

index.add({ id: 0, content: "some text" });
```

### Access documents from internal store

You can get indexed documents from the store:

```js
var data = index.get(1);
```

You can update/change store contents directly without changing the index by:

```js
index.set(1, data);
```

To update the store and also update the index then just use `index.update`, `index.add` or `index.append`.

When you perform a query, weather it is a document index or a flat index, then you will always get back an array of IDs.

Optionally you can enrich the query results automatically with stored contents by:

```js
index.search(query, { enrich: true });
```

Your results look now like:

```js
[
  {
    id: 0,
    doc: {
      /* content from store */
    },
  },
  {
    id: 1,
    doc: {
      /* content from store */
    },
  },
];
```

### Configure Storage (Recommended)

This will add just specific fields from a document to the store (the ID isn't necessary to keep in store):

```js
const index = new Document({
  document: {
    index: "content",
    store: ["author", "email"],
  },
});

index.add(id, content);
```

You can configure independently what should being indexed and what should being stored. It is highly recommended to make use of this whenever you can.

Here a useful example of configuring doc and store:

```js
const index = new Document({
  document: {
    index: "content",
    store: ["author", "email"],
  },
});

index.add({
  id: 0,
  author: "Jon Doe",
  email: "john@mail.com",
  content: "Some content for the index ...",
});
```

You can query through the contents and will get back the stored values instead:

```js
index.search("some content", { enrich: true });
```

Your results are now looking like:

```js
[
  {
    field: "content",
    result: [
      {
        id: 0,
        doc: {
          author: "Jon Doe",
          email: "john@mail.com",
        },
      },
    ],
  },
];
```

Both field "author" and "email" are not indexed.

<a name="chaining"></a>

### Chaining

Simply chain methods like:

```js
var index = FlexSearch.create()
  .addMatcher({ â: "a" })
  .add(0, "foo")
  .add(1, "bar");
```

```js
index.remove(0).update(1, "foo").add(2, "foobar");
```

<a name="contextual_enable"></a>
