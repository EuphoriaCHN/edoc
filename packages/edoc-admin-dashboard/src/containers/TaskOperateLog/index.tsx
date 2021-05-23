import React from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash-es';
import fuzzy from 'fuzzy';

import { Table, PageHeader, message, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { ConfigApi } from '@/api';
import { TargetTopicLabel, TextResource, OperationType, CallbackTimeLabel } from '@/common/utils/constants';

import { ColumnsType } from 'antd/lib/table/interface';

import './index.scss';

interface IProps {

}

let originalData: any[] = [];

function TaskOperateLog(props: IProps) {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { t } = useTranslation();

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await ConfigApi.getLog();

      originalData = data;
      setData(data);
    } catch (err) {
      message.error(err.message || JSON.stringify(err));
      message.error(t('拉取操作日志失败'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const tableColumns = React.useMemo<ColumnsType<any>>(() => [{
    title: 'ID',
    render(_, record: any) {
      return <span dangerouslySetInnerHTML={{ __html: record.searchedId || record.id }} />
    }
  }, {
    title: 'Topic',
    dataIndex: 'topicEnum',
    render(key: any) {
      return TargetTopicLabel[key].label;
    }
  }, {
    title: t('回调时间'),
    dataIndex: 'callBackTimeEnum',
    render(key: any) {
      return CallbackTimeLabel[key].label;
    },
  }, {
    title: t('操作类型'),
    dataIndex: 'operatorEnum',
    render(key: any) {
      return OperationType[key].label;
    }
  }, {
    title: t('文案来源'),
    dataIndex: 'originEnum',
    render(key: any) {
      return TextResource[key].label;
    }
  }, {
    title: t('文案版本'),
    render(_, record: any) {
      return <span dangerouslySetInnerHTML={{ __html: record.searchedDocOssVersionId || record.docOssVersionId }} />
    }
  }], []);

  const onSearchTextVersionChangeDebounced = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(debounce(ev => {
    if (!ev.target.value) {
      return setData(originalData);
    }

    const ans = fuzzy.filter(ev.target.value, data, {
      extract(el) {
        return el.docOssVersionId
      },
      pre: '<span class="task-log-table-search-highlight">',
      post: '</span>'
    }).map(({ original, string }) => Object.assign({}, original, { searchedDocOssVersionId: string }));

    setData(ans);
  }, 500), [data]);

  const onSearchIDChangeDebounced = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(debounce(ev => {
    if (!ev.target.value) {
      return setData(originalData);
    }

    const ans = fuzzy.filter(ev.target.value, data, {
      extract(el) {
        return el.id
      },
      pre: '<span class="task-log-table-search-highlight">',
      post: '</span>'
    }).map(({ original, string }) => Object.assign({}, original, { searchedId: string }));

    setData(ans);
  }, 500), [data]);

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <div className={'content-container task-log'}>
      <PageHeader
        title={t('任务操作日志')}
        subTitle={t('在这里查看定时任务操作日志')}
        ghost={false}
        className={'task-log-header'}
      />
      <div className={'task-log-filters'}>
        <Input
          style={{ width: 200 }}
          onChange={onSearchIDChangeDebounced}
          prefix={<SearchOutlined />}
          placeholder={t('搜索 ID')}
          allowClear
        />
        <Input
          style={{ width: 200 }}
          onChange={onSearchTextVersionChangeDebounced}
          prefix={<SearchOutlined />}
          placeholder={t('搜索文案版本')}
          allowClear
        />
      </div>
      <Table
        loading={loading}
        columns={tableColumns}
        dataSource={data}
        className={'task-log-table'}
        pagination={{
          pageSize: 10
        }}
      />
    </div>
  );
}

export default TaskOperateLog;
