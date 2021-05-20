import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Form, Modal, Input, Switch, message, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (params: any) => Promise<void>;
  disabledCreateDir?: boolean;
}

function CreateDocumentModal(props: IProps) {
  const [loading, setLoading] = React.useState<boolean>(false);

  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleOnOk = async () => {
    setLoading(true);

    const { name, isDir = false } = form.getFieldsValue(['name', 'isDir']);

    const nameErrors: string[] = [];

    switch (true) {
      case !name:
        nameErrors.push(t('文档名称是必填项'));
        break;
      case name[0] === ' ':
        nameErrors.push(t('文档名称开头不能是空格'));
        break;
      case name.length > 16:
        nameErrors.push(t('文档名称不能大于 16 个字符'));
        break;
      case !/^[\u4E00-\u9FA5a-zA-Z][\u4E00-\u9FA5a-zA-Z0-9 _]*$/.test(name):
        nameErrors.push(t('文档名称必须由中文、英文字母、空格或下划线组成'));
        break;
    }

    if (!!nameErrors.length) {
      setLoading(false);
      return form.setFields([
        { name: 'name', errors: nameErrors },
      ]);
    }

    form.setFields([{ name: 'name', errors: [] }]);

    const requestData = {
      isDir,
      documentName: name,
      documentDesc: ''
    };

    try {
      await props.onOk(requestData);
      message.success(!!isDir ? t('文件夹已创建') : t('文档已创建'));
      props.onCancel();
    } catch (err) {
      message.error(t('创建文档失败'));
      message.error(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!!props.visible) {
      form.setFieldsValue({
        name: '',
        isDir: false
      });
    }
  }, [props.visible]);

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      okText={t('确定')}
      cancelText={t('取消')}
      title={t('新建文档')}
      okButtonProps={{ loading }}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      onOk={handleOnOk}
    >
      <Form form={form}>
        <Form.Item
          label={t('文档名称')}
          name={'name'}
          required
        >
          <Input placeholder={t('请输入文档名称')} />
        </Form.Item>
        {!!props.disabledCreateDir ? null : (
          <Form.Item
            label={t('是否为文件夹')}
            name={'isDir'}
          >
            <Switch disabled={!!props.disabledCreateDir} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

export default CreateDocumentModal;
