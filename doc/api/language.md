## Add language-specific stemmer and/or filter

> **Stemmer:** several linguistic mutations of the same word (e.g. "run" and "running")

> **Filter:** a blacklist of words to be filtered out from indexing at all (e.g. "and", "to" or "be")

Assign a private custom stemmer or filter during creation/initialization:

```js
var index = new FlexSearch({
  stemmer: {
    // object {key: replacement}
    ational: "ate",
    tional: "tion",
    enci: "ence",
    ing: "",
  },
  filter: [
    // array blacklist
    "in",
    "into",
    "is",
    "isn't",
    "it",
    "it's",
  ],
});
```

Using a custom filter, e.g.:

```js
var index = new FlexSearch({
  filter: function (value) {
    // just add values with length > 1 to the index

    return value.length > 1;
  },
});
```

Or assign stemmer/filters globally to a language:

> Stemmer are passed as a object (key-value-pair), filter as an array.

```js
FlexSearch.registerLanguage("us", {
  stemmer: {
    /* ... */
  },
  filter: [
    /* ... */
  ],
});
```

Or use some pre-defined stemmer or filter of your preferred languages:

```html
<html>
  <head>
    <script src="js/flexsearch.bundle.js"></script>
    <script src="js/lang/en.min.js"></script>
    <script src="js/lang/de.min.js"></script>
  </head>
  ...
</html>
```

Now you can assign built-in stemmer during creation/initialization:

```js
var index_en = new FlexSearch.Index({
  language: "en",
});

var index_de = new FlexSearch.Index({
  language: "de",
});
```

In Node.js all built-in language packs files are available:

```js
const { Index } = require("flexsearch");

var index_en = new Index({
  language: "en",
});
```

<a name="rtl"></a>

## Right-To-Left Support

> Set the tokenizer at least to "reverse" or "full" when using RTL.

Just set the field "rtl" to _true_ and use a compatible tokenizer:

```js
var index = new Index({
  encode: (str) => str.toLowerCase().split(/[^a-z]+/),
  tokenize: "reverse",
  rtl: true,
});
```

<a name="cjk"></a>

## CJK Word Break (Chinese, Japanese, Korean)

Set a custom tokenizer which fits your needs, e.g.:

```js
var index = FlexSearch.create({
  encode: (str) => str.replace(/[\x00-\x7F]/g, "").split(""),
});
```

You can also pass a custom encoder function to apply some linguistic transformations.

```js
index.add(0, "一个单词");
```

```js
var results = index.search("单词");
```

## Languages

Language-specific definitions are being divided into two groups:

1. Charset
   1. **_encode_**, type: `function(string):string[]`
   2. **_rtl_**, type: `boolean`
2. Language
   1. **_matcher_**, type: `{string: string}`
   2. **_stemmer_**, type: `{string: string}`
   3. **_filter_**, type: `string[]`

The charset contains the encoding logic, the language contains stemmer, stopword filter and matchers. Multiple language definitions can use the same charset encoder. Also this separation let you manage different language definitions for special use cases (e.g. names, cities, dialects/slang, etc.).

To fully describe a custom language **on the fly** you need to pass:

```js
const index = FlexSearch({
  // mandatory:
  encode: (content) => [words],
  // optionally:
  rtl: false,
  stemmer: {},
  matcher: {},
  filter: [],
});
```

When passing no parameter it uses the `latin:default` schema by default.

<table>
    <tr></tr>
    <tr>
        <td>Field</td>
        <td>Category</td>
        <td>Description</td>
    </tr>
    <tr>
        <td><b>encode</b></td>
        <td>charset</td>
        <td>The encoder function. Has to return an array of separated words (or an empty string).</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>rtl</b></td>
        <td>charset</td>
        <td>A boolean property which indicates right-to-left encoding.</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>filter</b></td>
        <td>language</td>
        <td>Filter are also known as "stopwords", they completely filter out words from being indexed.</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>stemmer</b></td>
        <td>language</td>
        <td>Stemmer removes word endings and is a kind of "partial normalization". A word ending just matched when the word length is bigger than the matched partial.</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>matcher</b></td>
        <td>language</td>
        <td>Matcher replaces all occurrences of a given string regardless of its position and is also a kind of "partial normalization".</td>
    </tr>
</table>

### 1. Language Packs: ES6 Modules

The most simple way to assign charset/language specific encoding via modules is:

```js
import charset from "./dist/module/lang/latin/advanced.js";
import lang from "./dist/module/lang/en.js";

const index = FlexSearch({
  charset: charset,
  lang: lang,
});
```

Just import the **default export** by each module and assign them accordingly.

The full qualified example from above is:

```js
import { encode, rtl } from "./dist/module/lang/latin/advanced.js";
import { stemmer, filter, matcher } from "./dist/module/lang/en.js";

const index = FlexSearch({
  encode: encode,
  rtl: rtl,
  stemmer: stemmer,
  matcher: matcher,
  filter: filter,
});
```

The example above is the standard interface which is at least exported from each charset/language.

You can also define the encoder directly and left all other options:

```js
import simple from "./dist/module/lang/latin/simple.js";

const index = FlexSearch({
  encode: simple,
});
```

#### Available Latin Encoders

1. default
2. simple
3. balance
4. advanced
5. extra

You can assign a charset by passing the charset during initialization, e.g. `charset: "latin"` for the default charset encoder or `charset: "latin:soundex"` for a encoder variant.

#### Dialect / Slang

Language definitions (especially matchers) also could be used to normalize dialect and slang of a specific language.

### 2. Language Packs: ES5 (Language Packs)

You need to make the charset and/or language definitions available by:

1. All charset definitions are included in the `flexsearch.bundle.js` build by default, but no language-specific definitions are included
2. You can load packages located in `/dist/lang/` (files refers to languages, folders are charsets)
3. You can make a custom build

When loading language packs, make sure that the library was loaded before:

```html
<script src="dist/flexsearch.light.js"></script>
<script src="dist/lang/latin/default.min.js"></script>
<script src="dist/lang/en.min.js"></script>
```

When using the full "bundle" version the built-in latin encoders are already included and you just have to load the language file:

```html
<script src="dist/flexsearch.bundle.js"></script>
<script src="dist/lang/en.min.js"></script>
```

Because you loading packs as external packages (non-ES6-modules) you have to initialize them by shortcuts:

```js
const index = FlexSearch({
  charset: "latin:soundex",
  lang: "en",
});
```

> Use the `charset:variant` notation to assign charset and its variants. When just passing the charset without a variant will automatically resolve as `charset:default`.

You can also override existing definitions, e.g.:

```js
const index = FlexSearch({
  charset: "latin",
  lang: "en",
  matcher: {},
});
```

> Passed definitions will **not** extend default definitions, they will replace them.

When you like to extend a definition just create a new language file and put in all the logic.

#### Encoder Variants

It is pretty straight forward when using an encoder variant:

```html
<script src="dist/flexsearch.light.js"></script>
<script src="dist/lang/latin/advanced.min.js"></script>
<script src="dist/lang/latin/extra.min.js"></script>
<script src="dist/lang/en.min.js"></script>
```

When using the full "bundle" version the built-in latin encoders are already included and you just have to load the language file:

```html
<script src="dist/flexsearch.bundle.js"></script>
<script src="dist/lang/en.min.js"></script>
```

```js
const index_advanced = FlexSearch({
  charset: "latin:advanced",
});

const index_extra = FlexSearch({
  charset: "latin:extra",
});
```

### Partial Tokenizer

In FlexSearch you can't provide your own partial tokenizer, because it is a direct dependency to the core unit. The built-in tokenizer of FlexSearch splits each word into fragments by different patterns:

1. strict (supports contextual index)
2. forward
3. reverse (including forward)
4. full

### Language Processing Pipeline

This is the default pipeline provided by FlexSearch:

<p>
    <img src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch/doc/pipeline.svg?2">
</p>

#### Custom Pipeline

At first take a look into the default pipeline in `src/common.js`. It is very simple and straight forward. The pipeline will process as some sort of inversion of control, the final encoder implementation has to handle charset and also language specific transformations. This workaround has left over from many tests.

Inject the default pipeline by e.g.:

```js
this.pipeline(
  /* string: */ str.toLowerCase(),
  /* normalize: */ false,
  /* split: */ split,
  /* collapse: */ false
);
```

Use the pipeline schema from above to understand the iteration and the difference of pre-encoding and post-encoding. Stemmer and matchers needs to be applied after charset normalization but before language transformations, filters also.

Here is a good example of extending pipelines: `src/lang/latin/extra.js` → `src/lang/latin/advanced.js` → `src/lang/latin/simple.js`.

### How to contribute?

Search for your language in `src/lang/`, if it exists you can extend or provide variants (like dialect/slang). If the language doesn't exist create a new file and check if any of the existing charsets (e.g. latin) fits to your language. When no charset exist, you need to provide a charset as a base for the language.

A new charset should provide at least:

1. `encode` A function which normalize the charset of a passed text content (remove special chars, lingual transformations, etc.) and **returns an array of separated words**. Also stemmer, matcher or stopword filter needs to be applied here. When the language has no words make sure to provide something similar, e.g. each chinese sign could also be a "word". Don't return the whole text content without split.
2. `rtl` A boolean flag which indicates right-to-left encoding

Basically the charset needs just to provide an encoder function along with an indicator for right-to-left encoding:

```js
export function encode(str) {
  return [str];
}
export const rtl = false;
```

<a name="compare" id="compare"></a>

