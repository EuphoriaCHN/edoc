import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { calculatePagination } from '@/common/utils';

import { Spin, Pagination } from 'antd';
import PlatformOperationHeader, {
  IProps as PlatformOperationHeaderProps,
  InputItemOnChange
} from '@/components/PlatformOperationHeader';
import Empty from '@/components/Empty';
import CardContent from '@/components/CardContent';

import { PaginationProps } from 'antd/lib/pagination';

interface IProps<T extends object = any> {
  dataSource: T[];
  headerOptions: PlatformOperationHeaderProps;
  empty: {
    description: string;
    button?: React.ReactNode;
  }
  total: number;
  loading: boolean;
  loadData: <T extends { offset: number; limit: number; } & { [name: string]: string } = any>(query: T) => any;
  onCardClick: (record: T) => any;
  onCardDelete: (record: T) => any;
}

const DEFAULT_PAGINATION_DATA: PaginationProps = {
  current: 1,
  pageSize: 8,
  total: 0
};

function CardFilterContent (props: IProps) {
  const [paginationData, setPaginationData] = React.useReducer((
    state: PaginationProps,
    action: { type: 'current' | 'pageSize' | 'total', data: number }
  ) => {
    const { type, data } = action;
    const nextState = Object.assign({}, state);
    nextState[type] = data;
    return nextState;
  }, DEFAULT_PAGINATION_DATA);
  const filtersDataRef = React.useRef<{ [name: string]: string }>({});

  const { t } = useTranslation();

  const loadData = React.useCallback((filters: any = {}) => {
    const current = filters.current || paginationData.current;
    const pageSize = filters.pageSize || paginationData.pageSize;
    const filtersData = filtersDataRef.current;

    const { offset, limit } = calculatePagination(current, pageSize);

    const queryData: any = Object.assign({ 
      page: Math.floor(offset / limit) + 1, 
      size: limit 
    }, filtersData);

    props.loadData(queryData);
  }, [paginationData, props.loadData]);

  /**
   * Filter 发生变化
   */
  const packageOnFilterChange = React.useCallback((cb: InputItemOnChange): InputItemOnChange => ({ value, name }) => {
    filtersDataRef.current[name] = value;
    setPaginationData({ type: 'current', data: DEFAULT_PAGINATION_DATA.current || 0 });
    loadData({ current: DEFAULT_PAGINATION_DATA.current });
  }, [loadData]);

  /**
   * 分页改变
   */
  const onPaginationChange = React.useCallback((page: number, pageSize?: number) => {
    setPaginationData({ type: 'current', data: page });
    loadData({ current: page });
  }, [loadData]);

  /**
   * 当删除一个 Card
   */
  const handleOnCardDelete = React.useCallback(async (record: any) => {
    await props.onCardDelete(record);

    setPaginationData({ type: 'current', data: DEFAULT_PAGINATION_DATA.current || 0 });
    loadData({ current: DEFAULT_PAGINATION_DATA.current });
  }, [props.onCardDelete]);

  const renderEmpty = React.useMemo(() =>
    <Empty
      dataSets={{
        noData: props.empty,
      }}
      type={'noData'}
    />
  , [props.empty]);

  const renderContent = React.useMemo(() =>
    <React.Fragment>
      <CardContent 
        onClick={props.onCardClick} 
        onDelete={handleOnCardDelete}
        dataSource={props.dataSource} 
        colKey={'ID'} 
        loading={props.loading}
      />
      <Pagination
        {...paginationData}
        showTotal={(total, range) => t('第 {{start}}~{{end}} 项，共 {{total}} 项', {
          start: range[0],
          end: range[1],
          total
        })}
        className={'left-pagination'}
        onChange={onPaginationChange}
      />
    </React.Fragment>
  , [props.dataSource, props.loading, paginationData, onPaginationChange, props.onCardClick]);

  const headerOptions = React.useMemo<PlatformOperationHeaderProps>(() => {
    const { inputs, baseButtons } = props.headerOptions;

    const options = {
      inputs: inputs.map(item => {
        const onChange = typeof item.onChange === 'function' ? (...args: any[]) => {
          setPaginationData({ type: 'current', data: DEFAULT_PAGINATION_DATA.current || 0 });
          item.onChange && item.onChange(...args);
        } : (() => { });
        return Object.assign({}, item, {
          onChange: packageOnFilterChange(onChange)
        });
      }),
      baseButtons
    };

    return options;
  }, [props.headerOptions, packageOnFilterChange]);

  React.useEffect(() => {
    filtersDataRef.current = {};
    loadData();
  }, []);

  React.useEffect(() => {
    setPaginationData({ type: 'total', data: props.total });
  }, [props.total]);

  return (
    <Spin spinning={props.loading}>
      <PlatformOperationHeader {...headerOptions} />
      {props.dataSource.length ? renderContent : renderEmpty}
    </Spin>
  );
}

export default CardFilterContent;
