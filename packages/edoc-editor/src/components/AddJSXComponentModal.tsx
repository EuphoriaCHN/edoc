import * as React from 'react';
import { Modal, Select } from 'antd';
import { Renderer } from 'edoc-mdx-renderer';

import {
  mdxAntDComponentMap,
  mdxAntDVComponentMap,
  mdxAntDComponentList,
  mdxAntDVComponentList
} from '../constants/jsxComponents';

import { ModalProps } from 'antd/lib/modal/Modal';

export interface IAddJSXComponentModalProps extends Omit<ModalProps, 'onOk'> {
  onOk: (value: string) => void;
}

function AddJSXComponentModal(props: IAddJSXComponentModalProps) {
  const [mdxContent, setMdxContent] = React.useState<string>('');

  const handleOnSelect = React.useCallback((value: string) => {
    const content = mdxAntDComponentMap[value] || mdxAntDVComponentMap[value];
    setMdxContent(content || '');
  }, []);

  React.useEffect(() => {
    if (!props.visible) {
      setMdxContent('');
    } else {
      setMdxContent(mdxAntDComponentMap[mdxAntDComponentList[0]]);
    }
  }, [props.visible]);

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      title={'选择前端组件'}
      width={720}
      className={'add-jsx-component-modal'}
      onOk={() => typeof props.onOk === 'function' && props.onOk(mdxContent)}
    >
      <Select defaultValue={mdxAntDComponentList[0]} onSelect={handleOnSelect} filterOption>
        <Select.OptGroup label={'AntD 组件'}>
          {mdxAntDComponentList.map(name => (
            <Select.Option value={name} key={name}>{name}</Select.Option>
          ))}
        </Select.OptGroup>
        <Select.OptGroup label={'AntD Chart'}>
          {mdxAntDVComponentList.map(name => (
            <Select.Option value={name} key={name}>{name}</Select.Option>
          ))}
        </Select.OptGroup>
      </Select>
      <div className={'add-jsx-component-modal-renderer'}>
        <Renderer markdown={mdxContent} withoutAnchor={false} withoutLinkTitle />
      </div>
    </Modal>
  );
}

export default AddJSXComponentModal;
