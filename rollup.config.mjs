import { builtinModules } from "module";
import fs from "fs";
import resolve from "@rollup/plugin-node-resolve";

const { dependencies } = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url)));

export default {
    input: "src/index.js",
    output: [
        { file: "dist/plugin.js", format: "esm" },
        { file: "dist/plugin.cjs", format: "cjs", exports: "default" },
    ],
    plugins: [
        resolve(),
    ],
    external: builtinModules.concat(Object.keys(dependencies))
};