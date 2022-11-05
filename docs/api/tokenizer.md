## Tokenizer (Prefix Search)

Tokenizer affects the required memory also as query time and flexibility of partial matches. Try to choose the most upper of these tokenizer which fits your needs:

| Option        | Description                                    | Example                | Memory Factor (n = length of word) |
|---------------|------------------------------------------------|------------------------|------------------------------------|
| **"strict"**  | index whole words                              | `foobar`               | \* 1                               |
| **"forward"** | incrementally index words in forward direction | `fo`obar  <br>`foob`ar | \* n                               |
| **"reverse"** | incrementally index words in both directions   | foob`ar`  <br>fo`obar` | \* 2n - 1                          |
| **"full"**    | index every possible combination               | fo`oba`r  <br>f`oob`ar | \* n * (n - 1)                     |

## Add custom tokenizer

::: tip
A tokenizer split words/terms into components or partials.
:::

Define a private custom tokenizer during creation/initialization:

```js
var index = new FlexSearch({
  tokenize: function (str) {
    return str.split(/\s-\//g);
  },
});
```

> The tokenizer function gets a string as a parameter and has to return an array of strings representing a word or term. In some languages every char is a term and also not separated via whitespaces.
