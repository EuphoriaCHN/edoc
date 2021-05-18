import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Tabs } from 'antd';

import ProjectBaseInfo from './ProjectBaseInfo';

import './index.scss';

interface IProps {

}

function ProjectSetting(props: IProps) {
  const { t } = useTranslation();

  const tabPanes = React.useMemo(() => ([{
    tab: t('基本信息'),
    key: 'baseInfo',
    component: <ProjectBaseInfo />
  }]), []);

  return (
    <Tabs tabPosition={'left'} className={'project-setting'}>
      {tabPanes.map(item => (
        <Tabs.TabPane key={item.key} tab={item.tab}>
          <div className={'project-setting-container'}>
            {item.component}
          </div>
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
}

export default ProjectSetting;
