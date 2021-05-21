import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Menu } from 'antd';
import { useHistory, useLocation } from 'umi';

import { SettingOutlined, DashboardOutlined } from '@ant-design/icons';

import { MenuClickEventHandler } from 'rc-menu/lib/interface';

import './index.scss';

interface IProps {

}

function Sider(props: IProps) {
  const [activeKey, setActiveKey] = React.useState<string>('');
  const { t } = useTranslation();
  const _history = useHistory();
  const _location = useLocation();

  const menuItems = React.useMemo(() => [{
    title: t('定时任务配置'),
    key: 'config',
    icon: <SettingOutlined />
  }, {
    title: t('定时任务监控'),
    key: 'monitor',
    icon: <DashboardOutlined />
  }], []);

  const handleOnMenuClick = React.useCallback<MenuClickEventHandler>(({ key }) => {
    setActiveKey(key as any);
    _history.push(`${PREFIX}/${key}`);
  }, []);

  React.useEffect(() => {
    const activeKey = _location.pathname.split(/^\//)[1] || '';
    if (!!activeKey) {
      for (const item of menuItems) {
        if (item.key === activeKey) {
          setActiveKey(item.key);
          return;
        }
      }
    } else {
      _history.replace(`${PREFIX}/config`);
      setActiveKey('config');
    }
  }, []);

  return (
    <Layout.Sider theme={'light'} className={'site-content site-sider'}>
      <Menu selectedKeys={[activeKey]} onClick={handleOnMenuClick} theme={'light'}>
        {menuItems.map(item => <Menu.Item icon={item.icon} key={item.key}>{item.title}</Menu.Item>)}
      </Menu>
    </Layout.Sider>
  );
}

export default Sider;
