import * as React from 'react';
import * as AntDesignIconModules from '@ant-design/icons';

export default {
  Icon: props => {
    const { type } = props;
    if (typeof type !== 'string' || !type.length) {
      return null;
    }
    const IconElement = AntDesignIconModules[type];
    if (!IconElement) {
      return type;
    }
    return <IconElement {...props} />;
  },
  CNIcon: props => {
    const { scriptUrl } = props;
    if (typeof scriptUrl !== 'string' || !scriptUrl.length) {
      return null;
    }
    const Element = AntDesignIconModules.createFromIconfontCN({
      scriptUrl
    });
    return <Element />;
  }
};