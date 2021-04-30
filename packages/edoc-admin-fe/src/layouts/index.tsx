import * as React from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Layout } from 'antd';

import './index.scss';

function LayoutWrapper(props: React.PropsWithChildren<{}>) {
  return (
    <Layout>
      <Header />
      <Layout.Content className={'site-content'}>
        {props.children}
      </Layout.Content>
      <Footer />
    </Layout>
  );
}

export default LayoutWrapper;
