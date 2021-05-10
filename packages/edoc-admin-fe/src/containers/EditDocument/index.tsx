import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'umi';
import { prettierMDX } from '@/common/utils';

import { Button, message, Spin } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import Editor from '@/components/Editor';

import { DocumentAPI } from '@/api';

import './index.scss';

interface IProps {

}

function EditDocument(props: IProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);

  const editorInstanceRef = React.useRef<tuiEditor.Editor>();

  const { t } = useTranslation();

  const _history = useHistory();
  const { documentID } = useParams<{ documentID: string }>();

  const handleRouteBack = React.useCallback(() => {
    _history.goBack();
  }, []);

  const prettierContent = React.useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (!editorInstanceRef.current) {
        return reject(t('系统错误'));
      }

      const editorContent = editorInstanceRef.current.getValue();
      let prettiedContent = editorContent || '';
  
      try {
        prettiedContent = prettierMDX(prettiedContent);
        editorInstanceRef.current.setValue(prettiedContent);

        resolve(prettiedContent);
      } catch (err) {
        resolve(editorContent);
      }
    });
  }, []);

  const handleSaveDocument = React.useCallback(async () => {    
    try {
      setLoading(true);

      const prettiedContent = await prettierContent();

      await DocumentAPI.saveDocumentContent({
        docId: parseInt(documentID),
        content: prettiedContent
      });

      message.success(t('文档已保存'));
    } catch(err) {
      message.error(t('文档保存失败'));
      message.error(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePublishDocument = React.useCallback(async () => {
    try {
      setLoading(true);

      const prettiedContent = await prettierContent();

      await DocumentAPI.saveDocumentContent({
        docId: parseInt(documentID),
        content: prettiedContent
      });

      await DocumentAPI.publishDocument({ id: parseInt(documentID) });

      message.success(t('文档已发布'));
    } catch (err) {
      message.error(t('文档发布失败'));
      message.error(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const onEditorReady = React.useCallback(async (instance: tuiEditor.Editor) => {
    editorInstanceRef.current = instance;

    setLoading(true);
    try {
      const data = await DocumentAPI.getLatestContent({ id: documentID });
      instance.setValue(data.data || '');
    } catch (err) {
      message.error(t('获取文档内容失败'));
      message.error(err.message || JSON.stringify(err));
      instance.hide();
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!documentID || isNaN(parseInt(documentID))) {
      _history.push('/notFound');
      return;
    }
    setIsError(false);
  }, []);

  return (
    <div className={'edit-document'}>
      <Spin spinning={loading}>
        <header className={'edit-document-header'}>
          <Button onClick={handleRouteBack} type={'text'} icon={<LeftOutlined />}>{t('返回')}</Button>
          <div className={'edit-document-header-opts'}>
            <Button onClick={handleSaveDocument} disabled={isError}>{t('存草稿')}</Button>
            <Button onClick={handlePublishDocument} disabled={isError} type={'primary'}>{t('发布')}</Button>
          </div>
        </header>
        <Editor
          height={'calc(100vh - 60px)'}
          previewWidth={'calc(50vw - 1px)'}
          editorThemeClsName={'cm-s-darcula'}
          onReady={onEditorReady}
        />
      </Spin>
    </div>
  );
}

export default EditDocument;
