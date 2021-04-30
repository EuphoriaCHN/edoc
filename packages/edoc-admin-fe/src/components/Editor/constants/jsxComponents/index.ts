interface StringModuleMap {
    [name: string]: string;
}

// AntD Base Component
const mdxAntDComponentContext = require.context('./AntDComponents', false, /\.mdx?$/);
export const mdxAntDComponentMap: StringModuleMap = {};

for (const key of mdxAntDComponentContext.keys()) {
    mdxAntDComponentMap[key.split(/^\.\/(.+)\.mdx?$/)[1]] = mdxAntDComponentContext(key).default;
}
export const mdxAntDComponentList = Object.keys(mdxAntDComponentMap);

// AntDV
const mdxAntDVComponentContext = require.context('./AntDV', false, /\.mdx?$/);
export const mdxAntDVComponentMap: StringModuleMap = {};

for (const key of mdxAntDVComponentContext.keys()) {
    mdxAntDVComponentMap[key.split(/^\.\/(.+)\.mdx?$/)[1]] = mdxAntDVComponentContext(key).default;
}
export const mdxAntDVComponentList = Object.keys(mdxAntDVComponentMap);
