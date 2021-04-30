import * as React from 'react';
import classnames from 'classnames';

import { makeAnchorId } from './util';

export default {
  h4: ({ children }) => (
    <h4 className="md markdown gatsby-h4" id={makeAnchorId(children)}>
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="md markdown gatsby-h5" id={makeAnchorId(children)}>
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="md markdown gatsby-h6" id={makeAnchorId(children)}>
      {children}
    </h6>
  ),

  hr: () => <hr className={'gatsby-hr'} />,

  section: ({ children }) => {
    let id = '';
    if (Array.isArray(children)) {
      if (children[0].props.originalType === 'h2') {
        id = children[0] ? children[0].props.children : '';
      }
    } else {
      id = children.props.children;
    }

    return <section className="markdown md anchor-section">{children}</section>;
  },

  ul: ({ children }) => <ul className="md markdown gatsby-ul">{children}</ul>,
  ol: ({ children }) => <ol className="md markdown gatsby-ol">{children}</ol>,
  li: ({ children }) => <li className="md markdown gatsby-li">{children}</li>,

  p: ({ children }) => <div className="md markdown gatsby-p">{children}</div>,

  img: props => {
    return (
      <img
        {...props}
        className={classnames(props.className, 'gatsby-img')}
      />
    );
  },

  a: props => {
    let isExternal = false;
    if (((props || {}).href || '').match(/http(s|):\/\//)) {
      isExternal = true;
    }
    isExternal = true; // todo: 这个站内跳转怎么弄..
    if (isExternal) {
      return (
        <a href={props.href} className="md">
          {props.children}
        </a>
      );
    } else {
      return (
        <a href={props.href} className="md">
          {props.children}
        </a>
      );
    }
  },

  table: ({ children }) => (
    <div className="table-container">
      <table className="md markdown gatsby-table">{children}</table>
    </div>
  ),
}