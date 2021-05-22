import React from 'react';
import { useTranslation } from 'react-i18next';

import { Table, PageHeader, message } from 'antd';

import { ConfigApi } from '@/api';

import { ColumnsType } from 'antd/lib/table/interface';

interface IProps {

}

function TaskOperateLog(props: IProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { t } = useTranslation();

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const { data, total } = await ConfigApi.getLog();

      console.log(data);
    } catch (err) {
      message.error(err.message || JSON.stringify(err));
      message.error(t('拉取操作日志失败'));
    } finally {
      setLoading(false);
    }
  }, []);

  const tableColumns = React.useMemo<ColumnsType<any>>(() => [{

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
        dataSource={[]}
        className={'monitor-task-table'}
      />
    </div>
  );
}

export default TaskOperateLog;
