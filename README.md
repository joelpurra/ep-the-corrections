# [ep-the-corrections](https://github.com/joelpurra/ep-the-corrections)

For more background information, see the [projects related to the European Parliament](http://joelpurra.com/r/euparl) page.

Using data from [ep-erroneous-votes](https://github.com/joelpurra/ep-erroneous-votes), based on [open data dumps](http://parltrack.euwiki.org/dumps) from [Parltrack](http://parltrack.euwiki.org/), to visalize erroneous, and subsequently corrected, votes by [Members](http://www.europarl.europa.eu/meps/) of the [European Parliament](http://www.europarl.europa.eu/).

Developed during the [Europarl Hackathon](http://europarl.me/), in preparation for the [European elections 2014](http://www.elections2014.eu/).



## Requirements

1. Data generated by [ep-erroneous-votes](https://github.com/joelpurra/ep-erroneous-votes).



## Usage

```shell
$ node render-templates.js <args>
```

### Required arguments

- `--input-folder="/path/to/data/"`

### Optional arguments

- `--erroneous-votes="correctionals.json"` (relative to `--input-folder`)
- `--aggregates="aggregates.json"` (relative to `--input-folder`)
- `--grouped-by-mep="correctionals.grouped-by-mep.json"` (relative to `--input-folder`)
- `--templates-folder="templates/"` (relative to `src/`)
- `--output-folder="output/"` (relative to `src/`)

### Configuration

It's also possible to create a configuration file, `src/render-templates.js.config.json`, which can be used in place of the command line arguments and override values in `src/render-templates.js.defaults.config.json`. This is a per user/machine file, and should not be checked in.



## Todo

&#9744; Write more background information and in-depth explanations in the rendered output.
&#9744; Add links to the original data file from the generated files.
&#9745; Create reusable [doT](http://olado.github.io/doT/) definitions, scripts.
&#9745; ~~Create [jekyll](http://jekyllrb.com/) templates for the surrounding page stuff, like headers, footers, shared CSS.~~



## License

Copyright (c) 2014, 2014, 2015, 2016, 2017, [Joel Purra](http://joelpurra.com/) All rights reserved.

When using ep-the-corrections, comply to the [GNU Affero General Public License 3.0 (AGPL-3.0)](https://en.wikipedia.org/wiki/Affero_General_Public_License). Please see the LICENSE file for details.
