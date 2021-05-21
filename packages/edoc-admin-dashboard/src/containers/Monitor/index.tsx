import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, Tabs } from 'antd';
import { useLocation } from 'umi';

import MonitorTaskList from '@/components/MonitorTaskList';
import MonitorTaskDashboard from '@/components/MonitorTaskDashboard';

interface IProps {

}

function Monitor(props: IProps) {
  const [tabActiveKey, setTabActiveKey] = React.useState<string>('taskList');
  const { t } = useTranslation();
  const _location = useLocation();

  const tabPanels = React.useMemo(() => [{
    component: <MonitorTaskList />,
    key: 'taskList',
    title: t('任务列表')
  }, {
    component: <MonitorTaskDashboard />,
    key: 'taskDashboard',
    title: t('任务监控')
  }], []);

  const handleOnTabsChange = React.useCallback((activeKey: string) => {
    window.location.hash = `#${activeKey}`;
    setTabActiveKey(activeKey);
  }, []);

  React.useEffect(() => {
    let hashKey = _location.hash.split(/^#/)[1] || 'taskList';

    if (!['taskList', 'taskDashboard'].includes(hashKey)) {
      hashKey = 'taskList';
    }

    window.location.hash = `#${hashKey}`;
    setTabActiveKey(hashKey);
  }, []);

  return (
    <div className={'content-container monitor'}>
      <PageHeader
        title={t('定时任务监控')}
        subTitle={t('进行动态配置完成定时任务的创建。').concat(t('无需接入定时调度系统或手写代码即可完成对数据文本的定时持久化操作'))}
        ghost={false}
        className={'monitor-title'}
      />
      <Tabs onChange={handleOnTabsChange} activeKey={tabActiveKey}>
        {tabPanels.map(item => (
          <Tabs.TabPane tab={item.title} key={item.key}>
            {item.component}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
}

export default Monitor;
