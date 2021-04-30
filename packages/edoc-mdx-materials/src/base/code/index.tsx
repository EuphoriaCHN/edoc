import * as React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import classnames from 'classnames';

// import theme from 'prism-react-renderer/themes/dracula';
// import theme from 'prism-react-renderer/themes/duotoneDark';
//! import theme from 'prism-react-renderer/themes/duotoneLight';
// import theme from 'prism-react-renderer/themes/github';
// import theme from 'prism-react-renderer/themes/nightOwl';
//! import theme from 'prism-react-renderer/themes/nightOwlLight';
import theme from 'prism-react-renderer/themes/oceanicNext';
// import theme from 'prism-react-renderer/themes/okaidia';
//! import theme from 'prism-react-renderer/themes/palenight';
//! import theme from 'prism-react-renderer/themes/shadesOfPurple';
//! import theme from 'prism-react-renderer/themes/synthwave84';
//! import theme from 'prism-react-renderer/themes/ultramin';
//? import theme from 'prism-react-renderer/themes/vsDark';
// import theme from 'prism-react-renderer/themes/vsLight';

import { Language } from 'prism-react-renderer';

import './index.scss';

const highlightDefaultProps = Object.assign({}, defaultProps, {
  theme
});

function HighlightChildren(props: any) {
  const { className, style, tokens, getLineProps, getTokenProps } = props;

  return (
    <pre className={classnames(className, 'emm-code-block-pre')} style={style}>
      {tokens.map((line: any, i: number) => (
        <div className={'emm-code-block-line'} key={i} {...getLineProps({ line, key: i })}>
          <div className={'emm-code-block-line-no'}>{i + 1}</div>
          <div className={'emm-code-block-line-content'}>
            {line.map((token: any, key: number) => (
              <span {...getTokenProps({ token, key })} />
            ))}
          </div>
        </div>
      ))}
    </pre>
  );
}

interface IProps {
  children: string;
  className: string;
};

export function Block(props: IProps) {
  let { className = '', children = '' } = props;

  className = typeof className === 'string' ? className : '';
  children = typeof children === 'string' ? children.replace(/\n$/, '') : '';

  const languageCode = className.split(/-/)[1] as Language;

  return (
    <Highlight {...highlightDefaultProps} code={children} language={languageCode}>
      {HighlightChildren}
    </Highlight>
  );
};

export default Block;