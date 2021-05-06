import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Form, Modal, Input, Switch } from 'antd';

interface IProps {
    visible: boolean;
    onCancel: () => void;
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
                <Form.Item label={'是否为文件夹'} name={'isDir'}>
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CreateDocumentModal;
