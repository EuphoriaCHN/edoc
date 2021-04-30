import * as React from 'react';
import { debounce } from 'lodash-es';

import { Input, Button } from 'antd';

import { ButtonType } from 'antd/lib/button/button';

import './index.scss';

export type InputItemOnChange = (data: { value: string, name: string }) => void;

interface InputsItem {
  placeHolder?: string;
  prefix?: React.ReactNode;
  onChange?: InputItemOnChange;
  width?: number;
  name: string;
}

interface ButtonsItem {
  icon?: React.ReactNode;
  text: string;
  onClick?: () => void;
  type?: ButtonType;
}

export interface IProps {
  inputs: InputsItem[];
  baseButtons: ButtonsItem[];
}

function PlatformOperationHeader (props: IProps) {
  const handleInputChange = React.useCallback(debounce((value: string, name: string, cb?: InputItemOnChange) => {
    typeof cb === 'function' && cb({ value, name });
  }, 500), []);

  return (
    <header className={'platform-operation-header'}>
      <div>
        {props.inputs.map((item, index) =>
          <Input
            key={index}
            placeholder={item.placeHolder}
            width={item.width}
            prefix={item.prefix}
            onChange={ev => {
              const { value } = ev.target;
              handleInputChange(value, item.name, item.onChange);
            }}
            allowClear
          />
        )}
      </div>
      <div>
        {props.baseButtons.map((item, index) =>
          <Button key={index} type={item.type} onClick={item.onClick} icon={item.icon}>{item.text}</Button>
        )}
      </div>
    </header>
  );
}

export default PlatformOperationHeader;
