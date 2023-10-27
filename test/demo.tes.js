import assert from 'assert';
import { rollup } from 'rollup';
import importContent from '../dist/plugin.js';
import resolve from '@rollup/plugin-node-resolve';

//require('source-map-support').install();



// set current working directory to the root of the project
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Now you can use __dirname in your code
process.chdir(__dirname);

console.log(__dirname);


function executeBundle(bundle) {

    console.log('executeBundle');

    var generated = bundle.generate();
    var code = generated.code;

    var fn = new Function('assert', code);
    fn(assert);
}

describe('rollup-import-contents', function () {

    it('import plain text', function () {
        return rollup({
            input: 'samples/test-plain.js',
            output: [
                {
                    file: './bundle.js',
                    format: 'cjs'
                }
            ],
            plugins: [
                importContent({
                    rules: {
                        test: /\.json$/i,
                        mode: "plain"
                    }
                })
            ]
        }).then(async (bundle) => {
            bundle.write({
                file: './samples/test-plain-output.js',
                format: 'cjs'
            });
        });
    });

    it('import image in base64', function () {
        return rollup({
            input: 'samples/test-image.js',
            output: [
                {
                    file: './bundle.js',
                    format: 'cjs'
                }
            ],
            plugins: [
                importContent({
                    rules: {
                        test: /\.png$/i,
                        mode: "base64"
                    }
                })
            ]
        }).then(async (bundle) => {
            bundle.write({
                file: './samples/test-image-output.js',
                format: 'cjs'
            });
        });
    });

    it('import css minified', function () {
        return rollup({
            input: 'samples/test-css.js',
            output: [
                {
                    file: './bundle.js',
                    format: 'cjs'
                }
            ],
            plugins: [
                importContent({
                    rules: {
                        test: /\.css$/i,
                        mode: "css",
                        minimize: true
                    }
                })
            ]
        }).then(async (bundle) => {
            bundle.write({
                file: './samples/test-css-output.js',
                format: 'cjs'
            });
        });
    });

    it('import converted less', function () {
        return rollup({
            input: 'samples/test-less.js',
            output: [
                {
                    file: './bundle.js',
                    format: 'cjs'
                }
            ],
            plugins: [
                importContent({
                    rules: {
                        test: /\.less$/i,
                        mode: "less",
                        minimize: true
                    }
                })
            ]
        }).then(async (bundle) => {
            bundle.write({
                file: './samples/test-less-output.js',
                format: 'cjs'
            });
        });
    });

    it('import converted sass', function () {
        return rollup({
            input: 'samples/test-sass.js',
            output: [
                {
                    file: './bundle.js',
                    format: 'cjs'
                }
            ],
            plugins: [
                importContent({
                    rules: {
                        test: /\.s[ac]ss$/i,
                        mode: "sass",
                        minimize: true
                    }
                })
            ]
        }).then(async (bundle) => {
            bundle.write({
                file: './samples/test-sass-output.js',
                format: 'cjs'
            });
        });
    });

});