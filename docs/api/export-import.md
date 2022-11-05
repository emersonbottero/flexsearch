## Export

The export has slightly changed. The export now consist of several smaller parts, instead of just one large bulk. You need to pass a callback function which has 2 arguments "key" and "data". This callback function is called by each part, e.g.:

```js
index.export(function (key, data) {
  // you need to store both the key and the data!
  // e.g. use the key for the filename and save your data

  localStorage.setItem(key, data);
});
```

Exporting data to the localStorage isn't really a good practice, but if size is not a concern than use it if you like. The export primarily exists for the usage in Node.js or to store indexes you want to delegate from a server to the client.

> The size of the export corresponds to the memory consumption of the library. To reduce export size you have to use a configuration which has less memory footprint (use the table at the bottom to get information about configs and its memory allocation).

When your save routine runs asynchronously you have to return a promise:

```js
index.export(function (key, data) {
  return new Promise(function (resolve) {
    // do the saving as async

    resolve();
  });
});
```

> You cannot export the additional table for the "fastupdate" feature. These table exists of references and when stored they fully get serialized and becomes too large. The lib will handle these automatically for you. When importing data, the index automatically disables "fastupdate".

## Import

Before you can import data, you need to create your index first. For document indexes provide the same document descriptor you used when export the data. This configuration isn't stored in the export.

```js
var index = new Index({ ... });
```

To import the data just pass a key and data:

```js
index.import(key, localStorage.getItem(key));
```

You need to import every key! Otherwise, your index does not work. You need to store the keys from the export and use this keys for the import (the order of the keys can differ).

This is just for demonstration and is not recommended, because you might have other keys in your localStorage which aren't supported as an import:

```js
var keys = Object.keys(localStorage);

for (let i = 0, key; i < keys.length; i++) {
  key = keys[i];
  index.import(key, localStorage.getItem(key));
}
```
