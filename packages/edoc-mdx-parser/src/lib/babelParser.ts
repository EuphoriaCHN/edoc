import { transform } from '@babel/standalone';

export default function (jsxCode: string) {
  return transform(jsxCode, {
    presets: ['react'],
    minified: true,
    comments: false,
    parserOpts: {
      allowReturnOutsideFunction: true
    }
  });
}