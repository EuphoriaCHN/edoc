import * as React from 'react';
import { chunk, noop } from 'lodash-es';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Tooltip, Card, Typography, Skeleton, Row, Col, Avatar, Dropdown, Menu, Modal } from 'antd';
import { DownOutlined, DeleteOutlined } from '@ant-design/icons';

import Logo from '@/common/images/Logo.png';

import { MenuInfo } from 'rc-menu/lib/interface';

import './index.scss';

export type DefaultCardStructure = {
  ID: number;
  name: string;
  description: string;
};

interface IDefaultCardContentProps<T extends DefaultCardStructure = any> {
  data: T;
  onClick: (item: T) => any;
  onDelete: (item: T) => any;
  loading?: boolean;
}

export function DefaultCardContent (props: IDefaultCardContentProps) {
  const item = props.data;
  const onClick = props.onClick || noop;
  const onDelete = props.onDelete || noop;

  const { t } = useTranslation();

  const handleOnDeleteItem = (info: MenuInfo) => {
    const { domEvent } = info;

    domEvent.stopPropagation();

    Modal.confirm({
      title: t('确认删除？'),
      content: t('删除后数据无法恢复'),
      okText: t('删除'),
      cancelText: t('取消'),
      onOk: () => onDelete(item),
      onCancel: () => {},
      okButtonProps: { danger: true }
    });
  };

  const renderCardExtra = React.useMemo(() => props.loading ? null : (
    <Dropdown
      overlay={(
        <Menu>
          <Menu.Item onClick={handleOnDeleteItem} icon={<DeleteOutlined />} danger>{t('删除')}</Menu.Item>
        </Menu>
      )}
    >
      <a className={'ant-dropdown-link'} onClick={e => e.stopPropagation()}>
        {t('更多')} <DownOutlined />
      </a>
    </Dropdown>
  ), [handleOnDeleteItem, props.loading]);

  return (
    <Card 
      onClick={() => onClick(item)} 
      className={'card-content-card'}
      extra={renderCardExtra}
      title={item.projectName || item.pageName}
      hoverable
    >
      <Skeleton loading={props.loading} active>
        <Card.Meta
          avatar={<Avatar src={props.data?.feature?.logoSrc || Logo} />}
          title={(
            <Typography.Paragraph
              ellipsis={{
                rows: 1,
                tooltip: <Tooltip title={item.projectName || item.pageName}>{item.projectName || item.pageName}</Tooltip>
              }}
              className={'card-content-cols-title'}
            >
              {item.projectName || item.pageName}
            </Typography.Paragraph>
          )}
          description={(
            <Typography.Paragraph
              className={'card-content-cols-description'}
              ellipsis={{
                rows: 2,
                tooltip: <Tooltip title={item.projectDesc || item.pageDesc}>{item.projectDesc || item.pageDesc}</Tooltip>
              }}
            >
              {item.projectDesc || item.pageDesc || '-'}
            </Typography.Paragraph>
          )}
          key={item.id}
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
  onDelete?: (record: T) => any;

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
            : <DefaultCardContent data={item} onDelete={props.onDelete || noop} onClick={props.onClick || noop} loading={props.loading} />}
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
