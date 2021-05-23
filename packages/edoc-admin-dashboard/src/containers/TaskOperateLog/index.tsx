import React from 'react';
import { useTranslation } from 'react-i18next';

import { Table, PageHeader, message } from 'antd';

import { ConfigApi } from '@/api';
import { TargetTopicLabel, TextResource, OperationType, CallbackTimeLabel } from '@/common/utils/constants';

import { ColumnsType } from 'antd/lib/table/interface';

interface IProps {

}

function TaskOperateLog(props: IProps) {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { t } = useTranslation();

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const { data, total } = await ConfigApi.getLog();

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
    dataIndex: 'id'
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
    }
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
    dataIndex: 'docOssVersionId'
  }], []);

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
      <Table
        loading={loading}
        columns={tableColumns}
        dataSource={data}
        className={'monitor-task-table'}
      />
    </div>
  );
}

export default TaskOperateLog;
