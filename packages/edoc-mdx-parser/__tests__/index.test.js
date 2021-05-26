'use strict';

const { EdocMdxParser } = require('../dist/cjs');

test('mdx parser', () => {
    const mdxContent = `# Hello\n\nMy name is Euphoria`;

    const mdxParser = new EdocMdxParser();

    const jsxCode = mdxParser.md2JsxSync(mdxContent);
    const { contents: jsCode } = mdxParser.transformJsx(jsxCode.contents);

    console.log(mdxParser.hast);

    expect(1).toBe(1);
});