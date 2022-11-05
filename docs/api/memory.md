## Memory Allocation

The book "Gulliver's Travels Swift Jonathan 1726" was fully indexed for the examples below.

The most memory-optimized meaningful setting will allocate just 1.2 Mb for the whole book indexed! This is probably the most tiny memory footprint you will get from a search library.

```js
import { encode } from "./lang/latin/extra.js";

index = new Index({
  encode: encode,
  tokenize: "strict",
  optimize: true,
  resolution: 1,
  minlength: 3,
  fastupdate: false,
  context: false,
});
```

<a name="consumption"></a>

### Memory Consumption

The book "Gulliver's Travels" (Swift Jonathan 1726) was completely indexed for this test:

<br>
<img src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/doc/memory-comparison.svg?v=2">

### Compare Impact of Memory Allocation

by default a lexical index is very small:<br>
`depth: 0, bidirectional: 0, resolution: 3, minlength: 0` => 2.1 Mb

a higher resolution will increase the memory allocation:<br>
`depth: 0, bidirectional: 0, resolution: 9, minlength: 0` => 2.9 Mb

using the contextual index will increase the memory allocation:<br>
`depth: 1, bidirectional: 0, resolution: 9, minlength: 0` => 12.5 Mb

a higher contextual depth will increase the memory allocation:<br>
`depth: 2, bidirectional: 0, resolution: 9, minlength: 0` => 21.5 Mb

a higher minlength will decrease memory allocation:<br>
`depth: 2, bidirectional: 0, resolution: 9, minlength: 3` => 19.0 Mb

using bidirectional will decrease memory allocation:<br>
`depth: 2, bidirectional: 1, resolution: 9, minlength: 3` => 17.9 Mb

enable the option "fastupdate" will increase memory allocation:<br>
`depth: 2, bidirectional: 1, resolution: 9, minlength: 3` => 6.3 Mb

### Full Comparison Table

Every search library is constantly in competition with these 4 properties:

1. Memory Allocation
2. Performance
3. Matching Capabilities
4. Relevance Order (Scoring)

FlexSearch provides you many parameters you can use to adjust the optimal balance for your specific use-case.

| Modifier            | Memory Impact *   | Performance Impact ** | Matching Impact ** | Scoring Impact ** |
|---------------------|-------------------|-----------------------|--------------------|-------------------|
| resolution          | +1 (per level)    | +1 (per level)        | 0                  | +2 (per level)    |
| depth               | +4 (per level)    | -1 (per level)        | -10 + depth        | +10               |
| minlength           | -2 (per level)    | +2 (per level)        | -3 (per level)     | +2 (per level)    |
| bidirectional       | -2                | 0                     | +3                 | -1                |
| fastupdate          | +1                | +10 (update, remove)  | 0                  | 0                 |
| optimize: true      | -7                | -1                    | 0                  | -3                |
| encoder: "icase"    | 0                 | 0                     | 0                  | 0                 |
| encoder: "simple"   | -2                | -1                    | +2                 | 0                 |
| encoder: "advanced" | -3                | -2                    | +4                 | 0                 |
| encoder: "extra"    | -5                | -5                    | +6                 | 0                 |
| encoder: "soundex"  | -6                | -2                    | +8                 | 0                 |
| tokenize: "strict"  | 0                 | 0                     | 0                  | 0                 |
| tokenize: "forward" | +3                | -2                    | +5                 | 0                 |
| tokenize: "reverse" | +5                | -4                    | +7                 | 0                 |
| tokenize: "full"    | +8                | -5                    | +10                | 0                 |
| document index      | +3 (per field)    | -1 (per field)        | 0                  | 0                 |
| document tags       | +1 (per tag)      | -1 (per tag)          | 0                  | 0                 |
| store: true         | +5 (per document) | 0                     | 0                  | 0                 |
| store: \[fields\]   | +1 (per field)    | 0                     | 0                  | 0                 |
| cache: true         | +10               | +10                   | 0                  | 0                 |
| cache: 100          | +1                | +9                    | 0                  | 0                 |
| type of ids: number | 0                 | 0                     | 0                  | 0                 |
| type of ids: string | +3                | -3                    | 0                  | 0                 |

* range from -10 to 10, lower is better (-10 => big decrease, 0 => unchanged, +10 => big increase)<br>
** range from -10 to 10, higher is better

<a name="presets"></a>

