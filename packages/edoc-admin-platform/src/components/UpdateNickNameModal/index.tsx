import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, Form, Input, message } from 'antd';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  defaultValue: string | null;

  onOk: (data: string) => Promise<void>;
}

function UpdateNickNameModal(props: IProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleOnOk = React.useCallback(async () => {
    const nickName = form.getFieldValue('nickName');
    
    setLoading(true);
    try {
      await props.onOk(nickName);
      message.success(t('昵称已更新'));
      props.onCancel();
    } catch (err) {
      message.error(err.message || JSON.stringify(err));
      message.error(t('昵称更新失败'));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (props.visible) {
      form.setFields([{
        name: 'nickName',
        value: props.defaultValue || ''
      }]);
    }
  }, [props.visible, props.defaultValue]);

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      title={t('修改昵称')}
      okText={t('修改')}
      cancelText={t('取消')}
      onOk={handleOnOk}
      okButtonProps={{ loading }}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
    >
      <Form form={form}>
        <Form.Item label={t('昵称')} name={'nickName'}>
          <Input placeholder={t('请输入昵称')} autoFocus allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UpdateNickNameModal;
