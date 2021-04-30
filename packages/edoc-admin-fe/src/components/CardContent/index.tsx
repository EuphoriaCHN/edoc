import * as React from 'react';
import { chunk } from 'lodash-es';
import classnames from 'classnames';

import { Tooltip, Card, Typography, Skeleton, Row, Col, Avatar } from 'antd';

import Logo from '@/common/images/logo.png';

import './index.scss';

export type DefaultCardStructure = {
  ID: number;
  name: string;
  description: string;
};

interface IDefaultCardContentProps<T extends DefaultCardStructure = any> {
  data: T;
  onClick: (item: T) => any;
  loading?: boolean;
}

export function DefaultCardContent (props: IDefaultCardContentProps) {
  const item = props.data;
  const onClick = props.onClick || (() => { });
  return (
    <Card onClick={() => onClick(item)} className={'card-content-card'} hoverable>
      <Skeleton loading={props.loading} active>
        <Card.Meta
          avatar={<Avatar src={Logo} />}
          title={(
            <Typography.Paragraph
              ellipsis={{
                rows: 1,
                tooltip: <Tooltip title={item.name}>{item.name}</Tooltip>
              }}
              className={'card-content-cols-title'}
            >
              {item.name}
            </Typography.Paragraph>
          )}
          description={(
            <Typography.Paragraph
              className={'card-content-cols-description'}
              ellipsis={{
                rows: 3,
                tooltip: <Tooltip title={item.description}>{item.description}</Tooltip>
              }}
            >
              {item.description || '-'}
            </Typography.Paragraph>
          )}
          key={item.ID}
        />
      </Skeleton>
    </Card>
  );
}

interface IProps<T extends object = any> {
  dataSource: Array<T>;
  colKey: keyof T; // 每一个 Col 的 key 取值

  eachRowCards?: 24 | 12 | 8 | 6 | 4 | 2 | 1; // 每行几个
  loading?: boolean; // 加载状态
  loadingSkeletonRows?: number;

  cardRenderer?: (record: T) => JSX.Element; // 接管卡片渲染
  onClick?: (record: T) => any;

  className?: string;
}

const DEFAULT_PROPS: Pick<Required<IProps>, 'eachRowCards' | 'loadingSkeletonRows'> = {
  eachRowCards: 4,
  loadingSkeletonRows: 2
};

function CardContent (props: IProps) {
  const eachRowCards = props.eachRowCards || DEFAULT_PROPS.eachRowCards;
  const loadingSkeletonRows = props.loadingSkeletonRows || DEFAULT_PROPS.loadingSkeletonRows;

  // Chunk split
  const chunkedData = React.useMemo(() => {
    if (!Array.isArray(props.dataSource) || props.loading) {
      return chunk(Array(loadingSkeletonRows * eachRowCards).fill({}), eachRowCards);
    }
    return chunk(props.dataSource, eachRowCards);
  }, [props.dataSource, eachRowCards, props.loading, loadingSkeletonRows]);

  const renderCards = React.useMemo(() => chunkedData.map((itemRow, index) =>
    <Row className={'card-content-rows'} gutter={8} key={index}>
      {itemRow.map(item =>
        <Col className={'card-content-cols'} span={Math.floor(24 / eachRowCards)} key={item[props.colKey]}>
          {typeof props.cardRenderer === 'function'
            ? props.cardRenderer(item)
            : <DefaultCardContent data={item} onClick={props.onClick} loading={props.loading} />}
        </Col>
      )}
    </Row>
  ), [chunkedData, eachRowCards, props.colKey, props.loading, props.cardRenderer, props.onClick]);

  return (
    <div className={classnames('card-content-box', props.className)}>
      {renderCards}
    </div>
  );
}

export default CardContent;
