import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'umi';

import { Layout, Menu, Typography } from 'antd';

import Logo from '@/common/images/Logo.png';

import './index.scss';

interface IProps {

}

function Header (props: IProps) {
  const [visible, setVisible] = React.useState<boolean>(true);

  const { t } = useTranslation();
  const _history = useHistory();
  const _location = useLocation();

  // 如果进入到了文档编辑页面，不展示 Header
  React.useEffect(() => {
    if (/^\/siteDetail\/\d+\/\d+\/\d+/.test(_location.pathname)) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [_location.pathname]);

  /**
   * 跳转到主页
   */
  const handleTitleClick = React.useCallback(() => {
    _history.push('/');
  }, []);

  // todo:: Menu
  const menuItems = React.useMemo(() => [], []);

  if (!visible) {
    return null;
  }

  return (
    <Layout.Header className={'site-header'}>
      <div className={'site-header-title'} onClick={handleTitleClick}>
        <img className={'site-header-title-logo'} src={Logo} />
        <Typography.Title level={4}>{t('Edoc 管理端')}</Typography.Title>
      </div>
      <Menu theme={'dark'} mode={'horizontal'}>

      </Menu>
    </Layout.Header>
  );
}

export default Header;
