import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'umi';
import Cookie from 'js-cookie';
import { LoginAPI } from '@/api';

import { nanoid } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/store/UserStore';
import { Store } from '@/store';

import { Layout, Typography, Button, message } from 'antd';

import Logo from '@/common/images/Logo.png';

import './index.scss';

interface IProps {

}

function Header (this: any, props: IProps) {
  const [visible, setVisible] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { t } = useTranslation();
  const _history = useHistory();
  const _location = useLocation();
  const _dispatch = useDispatch();

  const userStore = useSelector<Store, Store['user']>(state => state.user);

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

  const handleLogout = React.useCallback(async (account: string) => {
    try {
      setLoading(true);
      await LoginAPI.logout({ account });

      message.success(t('用户已注销'));
      Cookie.remove(AUTHORIZATION_KEY);
      _dispatch(setUser({
        id: nanoid(),
        user: { account: null, avatarLink: null, mobile: null }
      }));
      handleTitleClick();
    } catch (err) {
      message.error(err.message || JSON.stringify(err));
      message.error(t('注销失败'));
    } finally {
      setLoading(false);
    }
  }, []);

  const renderUser = React.useMemo(() => {
    const { user } = userStore;
    if (!user.account) {
      return null;
    }

    return (
      <div className={'site-header-user'}>
        <Typography.Text>{t('欢迎！{{__edocUserName}}', { __edocUserName: user.account })}</Typography.Text>
        <Button loading={loading} size={'small'} onClick={handleLogout.bind(this, user.account)}>{t('注销')}</Button>
      </div>
    );
  }, [userStore.user, loading]);

  if (!visible) {
    return null;
  }

  return (
    <Layout.Header className={'site-header'}>
      <div className={'site-header-title'} onClick={handleTitleClick}>
        <img className={'site-header-title-logo'} src={Logo} />
        <Typography.Title level={4}>{t('Edoc 管理端')}</Typography.Title>
      </div>
      {renderUser}
    </Layout.Header>
  );
}

export default Header;
