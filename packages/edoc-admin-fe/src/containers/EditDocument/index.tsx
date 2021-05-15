import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'umi';
import { prettierMDX } from '@/common/utils';
import axios from 'axios';
import Cookie from 'js-cookie';
import copy from 'copy-to-clipboard';

import { Button, message, Spin, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import Editor from '@/components/Editor';

import { DocumentAPI, MiddlewareAPI } from '@/api';

import './index.scss';

interface IProps {

}

function EditDocument(props: IProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);

  const editorInstanceRef = React.useRef<tuiEditor.Editor>();

  const { t } = useTranslation();

  const _history = useHistory();
  const { documentID, pageLibraryID, siteID } = useParams<{ documentID: string; pageLibraryID: string; siteID: string }>();

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

      const onlineURL = `${ONLINE_URL}/content/${siteID}/${pageLibraryID}/${documentID}`;
      
      copy(onlineURL);
      message.success(t('文档已发布'));
      message.success((
        <React.Fragment>
          <Typography.Text>{t('线上地址：').concat(onlineURL)}</Typography.Text>
          <Typography.Link style={{ display: 'inline-block', marginLeft: 8 }} href={onlineURL} target={'__blank'}>{t('前往线上')}</Typography.Link>
        </React.Fragment>
      ));
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

  /**
   * 处理添加图片
   */
  const handleUploadImage = React.useCallback((blob: File, callback: (placeholder: string, alterName?: string | undefined) => void) => {
    const formData = new FormData();
    formData.append('multipartFile', blob, blob.name);

    axios.post(MiddlewareAPI.uploadImage, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': Cookie.get(AUTHORIZATION_KEY)
      }
    }).then(({ data: resData }) => {
      const { success, errorMsg, data } = resData;
      if (!success) {
        message.error(t('上传图片失败'));
        message.error(errorMsg);
      } else {
        callback(data);
      }
    }, err => {
      message.error(t('上传图片失败'));
      message.error(err.message || JSON.stringify(err));
    });
  }, [])

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
          addImageBlobHook={handleUploadImage}
          onReady={onEditorReady}
        />
      </Spin>
    </div>
  );
}

export default EditDocument;
