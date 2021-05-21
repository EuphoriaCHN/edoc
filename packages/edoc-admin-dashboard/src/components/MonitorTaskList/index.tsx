import React from 'react';
import { useTranslation } from 'react-i18next';

import { Table } from 'antd';

import { ColumnsType } from 'antd/lib/table/interface';

interface IProps {

}

function MonitorTaskList(props: IProps) {
  const { t } = useTranslation();

  const tableColumns = React.useMemo<ColumnsType<any>>(() => [{
    title: t('任务 ID')
  }, {
    title: t('创建时间')
  }, {
    title: t('回调时间')
  }, {
    title: t('是否回调')
  }, {
    title: t('任务来源')
  }, {
    title: t('文案版本')
  }], []);

  return (
    <Table 
      columns={tableColumns}
    />
  );
}

export default MonitorTaskList;
