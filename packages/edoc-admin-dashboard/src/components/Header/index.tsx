import React from 'react';
import { useTranslation } from 'react-i18next';
import Cookie from 'js-cookie';
import { useHistory } from 'umi';
import { LANGS } from '@/common/utils/constants';

import { Layout, Typography, Menu, Dropdown, Button } from 'antd';
import { UserOutlined, LogoutOutlined, TranslationOutlined } from '@ant-design/icons';

import Logo from '@/common/images/Logo.png';

import { MenuClickEventHandler } from 'rc-menu/lib/interface';

import './index.scss';

interface IProps {

}

function Header(props: IProps) {
  const { t, i18n } = useTranslation();
  const _history = useHistory();

  /**
   * 跳转到主页
   */
  const handleTitleClick = React.useCallback(() => {
    // _history.push('/');
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

  return (
    <Layout.Header className={'site-header'}>
      <div className={'site-header-title'} onClick={handleTitleClick}>
        <img className={'site-header-title-logo'} src={Logo} />
        <Typography.Title level={4}>{t('Edoc 管理后台')}</Typography.Title>
      </div>
      <div className={'site-header-options'}>
        <Dropdown
          trigger={['click']}
          placement={'bottomRight'}
          overlay={(
            <Menu selectedKeys={[Cookie.get(I18N_COOKIE_KEY) || 'zh-CN']} onClick={handleChangeLocale}>
              {Object.keys(LANGS).map(locale => <Menu.Item key={locale}>{(LANGS as any)[locale]}</Menu.Item>)}
            </Menu>
          )}
        >
          <Button type={'text'} icon={<TranslationOutlined />}>{(LANGS as any)[i18n.language]}</Button>
        </Dropdown>
        {/* {renderUser} */}
      </div>
    </Layout.Header>
  );
}

export default Header;
