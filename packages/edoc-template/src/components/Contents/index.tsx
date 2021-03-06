import * as React from 'react';
import { Renderer } from 'edoc-mdx-renderer';
import { override } from 'edoc-mdx-materials';
import { useLocation } from 'umi';
import { REGEXPS } from '@/common/constants';

import useDocumentContent from '@/hooks/useDocumentContent';

import { Layout, Spin } from 'antd';

import './index.scss';

export interface IProps {

}

function Contents(props: IProps) {
  const _location = useLocation();
  const { data, start, loading } = useDocumentContent({}, [], { manual: true });

  const documentID = _location.pathname.split(REGEXPS.splitIDs)[3];

  React.useEffect(() => {
    if (!documentID) {
      return;
    }
    start({ id: documentID });
  }, [documentID]);

  return (
    <Layout.Content className={'content-area'}>
      <Spin spinning={loading}>
        <Renderer markdown={data || ''} components={Object.assign({}, override)} />
      </Spin>
    </Layout.Content>
  );
}

export default Contents;
