import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginWrapper from '@/components/LoginWrapper';
import AuthWrapper from '@/components/AuthWrapper';

import { Store } from '@/store';
import { useSelector } from 'react-redux';

import { Layout } from 'antd';

import './index.scss';

function LayoutWrapper(props: React.PropsWithChildren<{}>) {
  const { t } = useTranslation();
  const globalStore = useSelector<Store, Store['global']>(state => state.global);

  const renderHelmet = React.useMemo(() => <Helmet title={globalStore.helmet || t('海弘建站')} />, [globalStore.helmet]);

  const renderContent = React.useMemo(() => {
    const AuthContent = LoginWrapper(AuthWrapper(function (_: {}) {
      return <React.Fragment>{props.children}</React.Fragment>;
    }));

    return (
      <Layout>
        <Header />
        <Layout.Content className={'site-content'}>
          <AuthContent />
        </Layout.Content>
        <Footer />
      </Layout>
    );
  }, [props.children]);

  return (
    <React.Fragment>
      {renderHelmet}
      {renderContent}
    </React.Fragment>
  );
}

export default LayoutWrapper;
