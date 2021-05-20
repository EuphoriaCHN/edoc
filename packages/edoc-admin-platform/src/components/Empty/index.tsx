import * as React from 'react';
import classnames from 'classnames';

import { Empty as AntEmpty, Typography } from 'antd';

import './index.scss';

interface IProps {
  dataSets: {
    [type: string]: {
      description: string;
      button?: React.ReactNode;
    }
  };
  type: keyof IProps['dataSets'];
  className?: string;
}

function Empty (props: IProps) {
  const { type, dataSets } = props;
  const { description, button } = dataSets[type];

  return (
    <AntEmpty
      className={classnames('edoc-empty', props.className)}
      image={'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'}
      imageStyle={{
        height: 120,
      }}
      description={(
        <Typography.Text>{description}</Typography.Text>
      )}
    >
      {button || null}
    </AntEmpty>
  );
}

export default Empty;
