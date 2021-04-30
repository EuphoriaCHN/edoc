import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import Editor from '@/components/Editor';

import './index.scss';

interface IProps {

}

function EditDocument(props: IProps) {
  const { t } = useTranslation();

  const _history = useHistory();

  const handleRouteBack = React.useCallback(() => {
    _history.goBack();
  }, []);

  return (
    <div className={'edit-document'}>
      <header className={'edit-document-header'}>
        <Button onClick={handleRouteBack} type={'text'} icon={<LeftOutlined />}>返回</Button>
        <div className={'edit-document-header-opts'}>
          <Button>{t('存草稿')}</Button>
          <Button type={'primary'}>{t('发布')}</Button>
        </div>
      </header>
      <Editor
        height={'calc(100vh - 60px)'}
        previewWidth={'calc(50vw - 1px)'}
        editorThemeClsName={'cm-s-darcula'}
      />
    </div>
  );
}

export default EditDocument;
