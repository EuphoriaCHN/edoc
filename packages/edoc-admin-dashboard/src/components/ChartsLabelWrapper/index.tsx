import React from 'react';
import classnames from 'classnames';

import { Typography } from 'antd';

import './index.scss';

interface IProps {
  title?: string;
  bordered?: boolean;

  titleMarginBottom?: number;
}

function ChartsLabelWrapper(props: React.PropsWithChildren<IProps>) {
  return (
    <div 
      className={classnames('charts-label-wrapper', {
        'charts-label-wrapper-bordered': !!props.bordered
      })}
    >
      <Typography.Title 
        level={5} 
        className={'charts-label-wrapper-title'}
        style={{ marginBottom: props.titleMarginBottom || 0 }}
      >
        {props.title || ''}
      </Typography.Title>
      {props.children}
    </div>
  );
}

export default ChartsLabelWrapper;
