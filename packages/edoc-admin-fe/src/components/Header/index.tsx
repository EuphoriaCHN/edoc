import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'umi';
import Cookie from 'js-cookie';
import { LoginAPI } from '@/api';

import { nanoid } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/store/UserStore';
import { Store } from '@/store';

import { Layout, Typography, Button, message, Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, LogoutOutlined, TranslationOutlined } from '@ant-design/icons';

import Logo from '@/common/images/Logo.png';

import { MenuClickEventHandler } from 'rc-menu/lib/interface';

import './index.scss';

interface IProps {

}

function Header(this: any, props: IProps) {
  const [visible, setVisible] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { t, i18n } = useTranslation();
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

  /**
   * 前往个人中心
   */
  const handleRouteToProfile = React.useCallback(() => {
    _history.push('/userCenter');
  }, []);

  /**
   * 切换语言
   */
  const handleChangeLocale = React.useCallback<MenuClickEventHandler>(({ key }) => {
    if (Cookie.get(I18N_COOKIE_KEY) !== key) {
      Cookie.set(I18N_COOKIE_KEY, key as string, { expires: 365 });
      location.reload();
    }
  }, []);

  const renderUser = React.useMemo(() => {
    const { user } = userStore;
    if (!user.account) {
      return null;
    }

    return (
      <div className={'site-header-user'}>
        <Dropdown
          placement={'bottomRight'}
          trigger={['click']}
          overlay={(
            <div className={'site-header-user-dropdown'}>
              <div className={'site-header-user-dropdown-info'}>
                <Avatar
                  src={user.avatarLink || undefined}
                  icon={!!user.avatarLink ? undefined : <UserOutlined />}
                />
                <div>
                  <Typography.Text
                    className={'site-header-user-dropdown-info-name'}
                  >
                    {user.userName || user.account}
                  </Typography.Text>
                  <Typography.Text
                    className={'site-header-user-dropdown-info-phone'}
                  >
                    {user.mobile || t('未设置手机号')}
                  </Typography.Text>
                </div>
              </div>
              <Menu className={'site-header-user-dropdown-menu'} selectable={false}>
                <Menu.Item onClick={handleRouteToProfile} icon={<UserOutlined />}>{t('个人中心')}</Menu.Item>
                <Menu.Item
                  icon={<LogoutOutlined />}
                  onClick={handleLogout.bind(this, user.account)}
                  danger
                >
                  {t('登出账号')}
                </Menu.Item>
              </Menu>
            </div>
          )}
          arrow
        >
          <Avatar
            className={'site-header-user-avatar'}
            src={user.avatarLink || undefined}
            icon={!!user.avatarLink ? undefined : <UserOutlined />}
          />
        </Dropdown>
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
      <div className={'site-header-options'}>
        <Dropdown
          trigger={['click']}
          placement={'bottomRight'}
          overlay={(
            <Menu selectedKeys={[Cookie.get(I18N_COOKIE_KEY) || 'zh-CN']} onClick={handleChangeLocale}>
              <Menu.Item key={'zh-CN'}>简体中文</Menu.Item>
              <Menu.Item key={'en-US'}>English</Menu.Item>
            </Menu>
          )}
        >
          <Button type={'text'} icon={<TranslationOutlined />}>{i18n.language.startsWith('zh') ? '简体中文' : 'English'}</Button>
        </Dropdown>
        {renderUser}
      </div>
    </Layout.Header>
  );
}

export default Header;
