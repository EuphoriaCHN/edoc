import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Cookie from 'js-cookie';

import { Upload, Modal, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import { UploadProps } from 'antd';

interface IProps {
  children: React.ReactNode;

  modalTitle?: string;

  text?: string;
  hint?: string;

  onSuccess?: (url: string) => void;
}

function UploadImageModal(this: any, props: IProps) {
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [uploadModalVisible, setUploadModalVisible] = React.useState<boolean>(false);
  const { t } = useTranslation();

  const onChange = React.useCallback<Required<UploadProps>['onChange']>(({ file }) => {
    if (file.status === 'uploading') {
      setUploading(true);
      return;
    }
    setUploading(false);

    if (file.status === 'error') {
      message.error('上传文件失败，请重新上传');
      !!file.error && message.error(file.error.message);
      return;
    }

    if (file.status === 'done') {
      const { success, errorMsg, data } = file.response || {};
      if (!success) {
        file.status = 'error';
        file.error = new Error('上传文件失败，请重新上传');
        message.error(errorMsg);
      } else {
        file.status = 'success';
        message.success(t('文件已上传'));
        typeof props.onSuccess === 'function' && props.onSuccess(data);
        setUploadModalVisible(false);
      }
    }
  }, []);

  return (
    <React.Fragment>
      <span onClick={setUploadModalVisible.bind(this, true)}>
        {props.children}
      </span>
      <Modal
        visible={uploadModalVisible}
        onCancel={uploading ? undefined : setUploadModalVisible.bind(this, false)}
        title={props.modalTitle || t('上传图片')}
        width={540}
        footer={null}
      >
        <Upload.Dragger
          accept={'image/*'}
          name={'multipartFile'}
          action={process.env.NODE_ENV === 'development' ? `${DEV_IP}/abs/middleware/uploadImage` : `${PROD_URL}/abs/middleware/uploadImage`}
          method={'post'}
          headers={{
            Authorization: Cookie.get(AUTHORIZATION_KEY) || ''
          }}
          onChange={onChange}
          disabled={uploading}
        >
          <p className={'ant-upload-drag-icon'}><InboxOutlined /></p>
          <p className={'ant-upload-text'}>{props.text || t('点击或拖拽本地图片到这里上传')}</p>
          <p className={'ant-upload-hint'}>{props.hint || t('支持的文件类型：png、jpg、jpeg、gif，每份文件不超过 10M')}</p>
        </Upload.Dragger>
      </Modal>
    </React.Fragment>
  );
}

export default UploadImageModal;
