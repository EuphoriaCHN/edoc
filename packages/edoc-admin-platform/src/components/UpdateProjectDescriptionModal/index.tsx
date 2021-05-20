import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, Form, Input, message } from 'antd';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  defaultValue: string | null;

  onOk: (data: string) => Promise<void>;
}

function UpdateProjectDescriptionModal(props: IProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleOnOk = React.useCallback(async () => {
    const projectDesc = form.getFieldValue('projectDesc');
    
    setLoading(true);
    try {
      await props.onOk(projectDesc);
      message.success(t('项目简介已更新'));
      props.onCancel();
    } catch (err) {
      message.error(err.message || JSON.stringify(err));
      message.error(t('项目简介更新失败'));
    } finally {
      setLoading(false);
    }
  }, [props.onOk]);

  React.useEffect(() => {
    if (props.visible) {
      form.setFields([{
        name: 'projectDesc',
        value: props.defaultValue || ''
      }]);
    }
  }, [props.visible, props.defaultValue]);

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      title={t('修改项目简介')}
      okText={t('修改')}
      cancelText={t('取消')}
      onOk={handleOnOk}
      okButtonProps={{ loading }}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
    >
      <Form form={form}>
        <Form.Item label={t('项目简介')} name={'projectDesc'}>
          <Input placeholder={t('请输入项目简介')} autoFocus allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UpdateProjectDescriptionModal;
