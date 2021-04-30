'use strict';

const { EdocMdxParser } = require('../dist/cjs');

test('mdx parser', () => {
    const mdxContent = `# Hello`;

    const mdxParser = new EdocMdxParser();

    const jsxCode = mdxParser.md2JsxSync(mdxContent);
    const { contents: jsCode } = mdxParser.transformJsx(jsxCode.contents);

    console.log(jsCode);

    expect(1).toBe(1);
});