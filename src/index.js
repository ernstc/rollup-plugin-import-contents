import less from 'less';
import * as sass from 'sass';
import postcss from 'postcss';
import cssnano from 'cssnano';
import * as fs from 'fs';
import * as path from 'path';
import { createFilter } from '@rollup/pluginutils';


const requireRegex = /require\(['"](.*)['"]\)/g;


const renderLessSync = (src) => {
    return less.render(fs.readFileSync(src, 'utf-8').toString(), {
        filename: path.resolve(src)
    })
        .then(function (output) {
            return output.css;
        }, function (error) {
            throw error;
        })
};


const mimifyCss = async (css) => {
    css = await postcss([cssnano({
        preset: 'default'
    })]).process(css, {
        from: undefined
    });
    return css.toString();
}


const getMediaType = (filename) => {
    const ext = filename.split('.').pop();
    switch (ext) {
        case 'ttf':
            return 'font/ttf';
        case 'woff':
            return 'font/woff';
        case 'woff2':
            return 'font/woff2';
        case 'png':
            return 'image/png';
        case 'jpg':
            return 'image/jpeg';
        case 'gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
}


export default function importContents(options = {}) {

    const filter = createFilter(
        options.include || ['**/*.js*', '**/*.ts*'],
        options.exclude || 'node_modules/**'
    );

    let rules = options.rules;
    if (rules) {
        if (Array.isArray(rules) === false) {
            rules = [rules];
        }
    }

    return {
        name: 'import-contents',

        async transform(code, id) {
            if (!rules || !filter(id)) return;

            var matches = code.matchAll(requireRegex);
            var items = [];
            while (true) {
                let match = matches.next();
                if (match.done) break;
                items.push(match.value);
            }

            // iterate over matches from the last to the first
            // to avoid messing up with the index
            for (let i = items.length - 1; i >= 0; i--) {
                let match = items[i];
                match = JSON.parse(JSON.stringify(match));

                // file content
                let requiredFilePath = path.resolve(path.dirname(id), match[1]);

                // find rule
                let rule = rules.find(rule => rule.test && match[1].match(rule.test));

                // if no rule found, skip
                if (!rule) continue;

                let genCode = null;

                if (rule.mode === 'base64') {
                    // load binary file content using fs
                    let bin = fs.readFileSync(requiredFilePath);

                    // encode in base64
                    let mediaType = getMediaType(requiredFilePath);
                    genCode = `"data:${mediaType};base64,${bin.toString('base64')}"`;
                }
                else if (rule.mode === 'plain') {
                    // load file content
                    let content = fs.readFileSync(requiredFilePath, 'utf-8').toString();

                    // final generated code
                    genCode = `${JSON.stringify(content)}`;
                }
                else if (rule.mode === 'css') {
                    // load css file content
                    let css = fs.readFileSync(requiredFilePath, 'utf-8').toString();

                    // minify css if required
                    if (rule.minimize === true) {
                        css = await mimifyCss(css);
                    }

                    // final generated code
                    genCode = `${JSON.stringify(css)}`;
                }
                else if (rule.mode === 'less') {
                    // render less to css
                    let css = await renderLessSync(requiredFilePath);

                    // minify css if required
                    if (rule.minimize === true) {
                        css = await mimifyCss(css);
                    }

                    // final generated code
                    genCode = `${JSON.stringify(css)}`;
                }
                else if (rule.mode === 'sass') {
                    // render sass to css
                    let output = await sass.compileAsync(requiredFilePath);
                    let css = output.css.toString();

                    // minify css if required
                    if (rule.minimize === true) {
                        css = await mimifyCss(css);
                    }

                    // final generated code
                    genCode = `${JSON.stringify(css)}`;
                }

                // replace require match with generated code
                if (genCode != null) {
                    code = code.replace(match[0], genCode);
                }
            }

            return {
                code: code,
                map: null
            };
        }
    };
}