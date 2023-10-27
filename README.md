# rollup-import-contents
A Rollup plugin to import content as strings like CSS, LESS and Fonts.

![Actions](https://github.com/ernstc/rollup-import-contents/workflows/build/badge.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ernstc/rollup-import-contents/blob/master/LICENSE)


---

## Usage

`rollup.config.mjs`
```js
import importContents from "rollup-import-contents";

export default {
    input: "index.js",
    output: { file: "dist/index.js", format: "esm" },
    plugins: [ 
        importContents({
            rules: [
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    mode: "base64"
                },
                {
                    test: /\.(png|jpg|gif)$/i,
                    mode: "base64"
                },
                {
                    test: /\.less$/i,
                    mode: "less"
                }
            ]
        }) 
    ]
};
```

This plugins supports require forms of importing files.
```js
const css = require("./styles.css"); /* creates a string that contains the content of the CSS file */
const parsedCss = require("./styles.less"); /* creates a string that contains the CSS code parsed from the LESS file */
const font = require("./font.woff"); /* creates a string with the content of the font in base64 data URL */
```

---

## Options

### include

Type: `array` or `string`
Default: `[]`

A single file, or array of files to include when minifying.

### exclude

Type: `array` or `string`
Default: `[]`

A single file, or array of files to exclude when minifying.

### rules

Type: `Array`
Default: `null`

A collection of rules for processing imported files. Each element is defined as
```js
{
    test: RegularExpression,
    mode: "plain" | "base64" | "css" | "less" | "sass",
    minimize: boolean
}
```

The option `minimize` works only for `css`, `less` and `sass`.

---

## Why

With **Web Component** frameworks, its useful to be able to import the css for components in a variety of ways. Other solutions for Rollup either lack features or are large and bloated with extra features that some users may not need such as SASS or LESS support. 

---

## Reporting Issues

If you are having trouble getting something to work with this plugin or run into any problems, you can create a new [Issue](https://github.com/ernstc/rollup-import-contents/issues).

If this plugin does not fit your needs or is missing a feature you would like to see, let us know! We would greatly appreciate your feedback on it.

---

## License

rollup-import-contents is licensed under the terms of the [**MIT**](https://github.com/ernstc/rollup-import-contents/blob/master/LICENSE) license.