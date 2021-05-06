import * as React from 'react';
import { Renderer } from 'edoc-mdx-renderer';
import { override } from 'edoc-mdx-materials';
import { useLocation } from 'umi';
import { REGEXPS } from '@/common/constants';

import useDocumentContent from '@/hooks/useDocumentContent';

import { Layout } from 'antd';

import './index.scss';

export interface IProps {

}

function Contents(props: IProps) {
  const _location = useLocation();
  const { data, start } = useDocumentContent({}, [], { manual: true });

  const documentID = _location.pathname.split(REGEXPS.splitIDs)[2];

  React.useEffect(() => {
    if (!documentID) {
      return;
    }
    start({ documentID });
  }, [documentID]);

  return (
    <Layout.Content className={'content-area'}>
      <Renderer markdown={(data || {}).content || ''} components={Object.assign({}, override)} />
    </Layout.Content>
  );
}

export default Contents;
