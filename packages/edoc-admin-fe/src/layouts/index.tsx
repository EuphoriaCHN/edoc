import * as React from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginWrapper from '@/components/LoginWrapper';
import AuthWrapper from '@/components/AuthWrapper';

import { Layout } from 'antd';

import './index.scss';

function LayoutWrapper(props: React.PropsWithChildren<{}>) {
  function Content(_: {}) {
    return <React.Fragment>{props.children}</React.Fragment>;
  }

  const AuthContent = LoginWrapper(AuthWrapper(Content));

  return (
    <Layout>
      <Header />
      <Layout.Content className={'site-content'}>
        <AuthContent />
      </Layout.Content>
      <Footer />
    </Layout>
  );
}

export default LayoutWrapper;
