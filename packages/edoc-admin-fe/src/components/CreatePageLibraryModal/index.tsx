import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, Form, Input } from 'antd';

interface IProps {
  visible: boolean;
  onCancel: () => void;
}

function CreatePageLibraryModal (props: IProps) {
  const [loading, setLoading] = React.useState<boolean>(false);

  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleOnOk = async () => {
    setLoading(true);

    const { name, description = '' } = form.getFieldsValue(['name', 'description']);

    const nameErrors: string[] = [];
    const descriptionErrors: string[] = [];

    switch (true) {
      case !name:
        nameErrors.push(t('页面库名称是必填项'));
        break;
      case name[0] === ' ':
        nameErrors.push(t('页面库名称开头不能是空格'));
        break;
      case name.length > 16:
        nameErrors.push(t('页面库名称不能大于 16 个字符'));
        break;
      case !/^[\u4E00-\u9FA5a-zA-Z][\u4E00-\u9FA5a-zA-Z0-9 _]*$/.test(name):
        nameErrors.push(t('页面库名称必须由中文、英文字母、空格或下划线组成'));
        break;
    }

    switch (true) {
      case description[0] === ' ':
        descriptionErrors.push(t('页面库描述开头不能是空格'));
        break;
      case description.length > 32:
        descriptionErrors.push(t('页面库描述不能大于 32 个字符'));
        break;
    }

    if (!!nameErrors.length || !!descriptionErrors.length) {
      setLoading(false);
      return form.setFields([
        { name: 'name', errors: nameErrors },
        { name: 'description', errors: descriptionErrors }
      ]);
    }

    form.setFields([
      { name: 'name', errors: [] },
      { name: 'description', errors: [] }
    ]);

    // todo:: 发起请求
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 1500);
    });
    setLoading(false);
    props.onCancel();
  };

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      okText={t('确定')}
      cancelText={t('取消')}
      title={t('新建页面库')}
      okButtonProps={{ loading }}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
    >
      <Form form={form}>
        <Form.Item
          label={t('页面库名称')}
          name={'name'}
          required
        >
          <Input placeholder={t('请输入页面库名称')} />
        </Form.Item>
        <Form.Item label={t('页面库介绍')} name={'description'}>
          <Input placeholder={t('请输入页面库介绍')} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreatePageLibraryModal;
