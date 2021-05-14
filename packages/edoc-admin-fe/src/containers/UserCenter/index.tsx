import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'umi';

import ProfileDescriptions from '@/components/ProfileDescriptions';

import { Layout, Menu } from 'antd';

import { SelectEventHandler } from 'rc-menu/lib/interface';

import './index.scss';

interface IProps {

}

function UserCenter(props: IProps) {
  const [menuActiveKey, setMenuActiveKey] = React.useState<keyof typeof menuItems>('profile');
  const { t } = useTranslation();

  const _location = useLocation();

  const menuItems = React.useMemo(() => ({
    profile: {
      component: <ProfileDescriptions />,
      label: t('个人信息')
    }
  }), []);

  const handleOnMenuSelect = React.useCallback<SelectEventHandler>(({ selectedKeys }) => {
    if (!!selectedKeys && !!selectedKeys.length) {
      setMenuActiveKey(selectedKeys[0] as any);
      location.hash = `#${selectedKeys[0]}`;
    }
  }, [])

  React.useEffect(() => {
    const hashKey = _location.hash.split(/^#(.+)$/)[1];

    if (!hashKey || !Object.keys(menuItems).includes(hashKey)) {
      setMenuActiveKey('profile');
    } else {
      setMenuActiveKey(hashKey as any);
    }
  }, []);

  return (
    <Layout className={'user-center'}>
      <Layout.Sider>
        <Menu
          mode={'inline'}
          selectedKeys={[menuActiveKey]}
          className={'user-center-menu'}
          onSelect={handleOnMenuSelect}
        >
          {Object.keys(menuItems).map(key => (
            <Menu.Item key={key}>{(menuItems as any)[key].label}</Menu.Item>
          ))}
        </Menu>
      </Layout.Sider>
      <Layout.Content className={'user-center-content'}>
        <div className={'user-center-content-container'}>
          {menuItems[menuActiveKey].component}
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default UserCenter;
