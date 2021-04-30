import * as React from 'react';

import AntDesignComponents from './antDesignComponents';
import AntDesignCharts from './antDesignCharts';
import AntDesignIcons from './antDesignIcons';

import CommonComponents from './common';

import { makeAnchorId } from './util';

export const getLinkTitle = (onCopy = () => { }) => ({
  h2: ({ children }) => {
    const hashAnchor = makeAnchorId(children) || undefined;
    return (
      <h2 className="md markdown gatsby-h2" id={hashAnchor}>
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const hashAnchor = makeAnchorId(children);
    return (
      <h3 className="md markdown gatsby-h3" id={hashAnchor}>
        {children}
      </h3>
    );
  }
});

export const getUnlinkTitle = () => ({
  h2: ({ children }) => (
    <h2 className="md markdown gatsby-h2" id={makeAnchorId(children)}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="md markdown gatsby-h3" id={makeAnchorId(children)}>{children}</h3>
  )
});

export const ProviderComponents = Object.assign({},
  AntDesignComponents,
  AntDesignIcons,
  AntDesignCharts,
  CommonComponents,
);

export const getDefaultProviderComponents = ({ withoutLinkTitle, onTitleCopy } = {}) => {
  return Object.assign({}, ProviderComponents, withoutLinkTitle ?
    getUnlinkTitle() :
    getLinkTitle(onTitleCopy || (() => { })));
};