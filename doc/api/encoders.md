
Encoding affects the required memory also as query time and phonetic matches. Try to choose the most upper of these encoders which fits your needs, or pass in a <a href="#flexsearch.encoder">custom encoder</a>:

| Option         | Description                                                                                                                                   | False-Positives | Compression |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-------------|
| **false**      | Turn off encoding                                                                                                                             | no              | 0%          |
| **"default"**  | Case in-sensitive encoding                                                                                                                    | no              | 0%          |
| **"simple"**   | Case in-sensitive encoding  <br>Charset normalizations                                                                                        | no              | ~ 3%        |
| **"balance"**  | Case in-sensitive encoding  <br>Charset normalizations  <br>Literal transformations                                                           | no              | ~ 30%       |
| **"advanced"** | Case in-sensitive encoding  <br>Charset normalizations  <br>Literal transformations  <br>Phonetic normalizations                              | no              | ~ 40%       |
| **"extra"**    | Case in-sensitive encoding  <br>Charset normalizations  <br>Literal transformations  <br>Phonetic normalizations  <br>Soundex transformations | yes             | ~ 65%       |
| **function()** | Pass custom encoding via _function(string):\[words\]_                                                                                         |                 |             |

## Encoder Matching Comparison

> Reference String: **"Björn-Phillipp Mayer"**

| Query               | default | simple  | advanced | extra   |
|---------------------|---------|---------|----------|---------|
| björn               | **yes** | **yes** | **yes**  | **yes** |
| björ                | **yes** | **yes** | **yes**  | **yes** |
| bjorn               | no      | **yes** | **yes**  | **yes** |
| bjoern              | no      | no      | **yes**  | **yes** |
| philipp             | no      | no      | **yes**  | **yes** |
| filip               | no      | no      | **yes**  | **yes** |
| björnphillip        | no      | **yes** | **yes**  | **yes** |
| meier               | no      | no      | **yes**  | **yes** |
| björn meier         | no      | no      | **yes**  | **yes** |
| meier fhilip        | no      | no      | **yes**  | **yes** |
| byorn mair          | no      | no      | no       | **yes** |
| _(false positives)_ | **no**  | **no**  | **no**   | yes     |