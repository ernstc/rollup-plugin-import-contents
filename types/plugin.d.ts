import { Plugin, LoadHook, TransformHook } from "rollup";

declare interface Rule {
    test: RegExp;
    mode: "plain" | "base64" | "css" | "less" | "sass";
    minimize?: boolean;
}

declare interface Options {
    include?: string | string[];
    exclude?: string | string[];
    rules?: Rule[];
}

export default function (options?: Options) : Plugin & {
    load: LoadHook;
    transform: TransformHook;
}