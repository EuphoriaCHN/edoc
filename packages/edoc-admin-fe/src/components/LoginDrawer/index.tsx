import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer, Tabs } from 'antd';

import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

function LoginDrawer(props: IProps) {
  const [tabKey, setTabKey] = React.useState<keyof typeof tabs>('login');
  const { t } = useTranslation();

  const tabs = React.useMemo(() => ({
    login: {
      title: t('登录'),
      component: <LoginForm />
    },
    register: {
      title: t('注册'),
      component: <RegisterForm />
    }
  }), []);

  return (
    <Drawer
      visible={props.visible}
      onClose={props.onClose}
      width={680}
    >
      <Tabs activeKey={tabKey} onChange={value => setTabKey(value as keyof typeof tabs)}>
        {Object.keys(tabs).map(key => (
          <Tabs.TabPane key={key} tab={tabs[key as keyof typeof tabs].title}>
            {tabs[key as keyof typeof tabs].component}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Drawer>
  );
}

export default LoginDrawer;
