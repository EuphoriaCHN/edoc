import * as React from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash-es';
import isMobilePhone from 'validator/es/lib/isMobilePhone';

import { ColProps } from 'antd/lib/grid/col';

import './index.scss';

interface IProps {

}

const REGEXPS = {
  account: /^[a-zA-Z0-9_]{3,16}$/, // Account 仅允许数字、字母 & 下划线
  password: /^[a-zA-Z0-9_!@#$%^&*\(\)<>/\\\[\]\{\};:"\',.\-\+~`]{6,16}$/
};

const CAPTCHA_WAITING_TIME = 10;

function RegisterForm(this: any, props: IProps) {
  const [allowedSendCaptcha, setAllowedSendCaptcha] = React.useState<boolean>(false);
  const [waitingCaptcha, setWaitingCaptcha] = React.useState<number>(0);

  const [form] = Form.useForm();
  const { t } = useTranslation();

  const formItemLayout = React.useMemo<{ labelCol: ColProps }>(() => ({
    labelCol: {
      span: 4
    }
  }), []);

  const handleOnSubmit = React.useCallback(async () => {
    const {} = form.getFieldsValue(['account', 'password', 'ensurePassword', 'phoneNumber', 'captcha']);
  }, []);

  /**
   * Check 账号
   */
  const handleOnAccountChangeDebounced = React.useCallback(debounce((data: string) => {
    if (!data || !data.length) {
      
      form.setFields([{ name: 'account', errors: [t('此项是必填项')] }]);
      return false;
    }
    if (!REGEXPS.account.test(data)) {
      form.setFields([{ name: 'account', errors: [t('用户名仅能由 3 到 16 位数字、字母与下划线组成')] }]);
      return false;
    }
    form.setFields([{ name: 'account', errors: [] }]);
    return true;
  }, 500), []);

  /**
   * Check 密码
   */
  const handleOnPasswordChangeDebounce = React.useCallback(debounce((data: string) => {
    if (!data || !data.length) {
      form.setFields([{ name: 'password', errors: [t('此项是必填项')] }]);
      return false;
    }
    if (!REGEXPS.password.test(data)) {
      form.setFields([{ name: 'password', errors: [t('密码仅能由 6 到 16 位数字、字母及特殊字符组成')] }]);
      return false;
    }
    form.setFields([{ name: 'password', errors: [] }]);
    return true;
  }, 500), []);

  /**
   * Check 确认密码
   */
  const handleOnEnsurePasswordChangeDebounce = React.useCallback(debounce((data: string) => {
    const password = form.getFieldValue('password');
    if (password !== data) {
      form.setFields([{ name: 'ensurePassword', errors: [t('两次输入的密码不一致')] }]);
      return false;
    }
    form.setFields([{ name: 'ensurePassword', errors: [] }]);
    return true;
  }), []);

  /**
   * Check 手机号
   */
  const handleOnPhoneNumberChangeDebounced = React.useCallback(debounce((data: string) => {
    if (!data || !data.length) {
      setAllowedSendCaptcha(false);
      form.setFields([{ name: 'phoneNumber', errors: [t('此项是必填项')] }]);
      return false;
    }
    if (!isMobilePhone(data, 'zh-CN')) {
      setAllowedSendCaptcha(false);
      form.setFields([{ name: 'phoneNumber', errors: [t('手机号格式不正确')] }]);
      return false;
    }
    form.setFields([{ name: 'phoneNumber', errors: [] }]);
    setAllowedSendCaptcha(true);
    return true;
  }, 500), []);

  /**
   * 发送验证码
   */
  const handleSendCaptcha = React.useCallback(async () => {
    setWaitingCaptcha(-1);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success(t('验证码将以短信形式发送到手机，请注意查收'));
    } catch (err) {
      setWaitingCaptcha(0);
      message.error(err.message || JSON.stringify(err));
      return message.error(t('发送验证码失败'));
    }

    let count = CAPTCHA_WAITING_TIME;
    setWaitingCaptcha(count);

    function timer(): any {
      return setTimeout(function() {
        count -= 1;
        setWaitingCaptcha(count);                
        if (!!count) {
          return timer();
        }
      }, 1000);
    }

    timer();
  }, []);

  const handleOnFormInputItemChange = React.useCallback((debouncedFunc: ReturnType<typeof debounce>, event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedFunc(event.target.value);
  }, []);

  return (
    <Form {...formItemLayout} form={form} className={'register-form'}>
      <Form.Item
        name={'account'}
        label={t('用户名')}
      >
        <Input onChange={handleOnFormInputItemChange.bind(this, handleOnAccountChangeDebounced)} allowClear />
      </Form.Item>
      <Form.Item
        name={'password'}
        label={t('密码')}
      >
        <Input.Password
          onChange={handleOnFormInputItemChange.bind(this, handleOnPasswordChangeDebounce)} 
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
          allowClear
        />
      </Form.Item>
      <Form.Item
        name={'ensurePassword'}
        label={t('确认密码')}
      >
        <Input.Password
          onChange={handleOnFormInputItemChange.bind(this, handleOnEnsurePasswordChangeDebounce)} 
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
          allowClear
        />
      </Form.Item>
      <Form.Item
        name={'phoneNumber'}
        label={t('手机号')}
      >
        <Input onChange={handleOnFormInputItemChange.bind(this, handleOnPhoneNumberChangeDebounced)} allowClear />
      </Form.Item>
      <Form.Item
        label={t('验证码')}
        extra={t('我们必须确保这不是计算机在操作')}
      >
        <Row gutter={16}>
          <Col span={14}>
            <Form.Item
              name={'captcha'}
              noStyle
            >
              <Input />
            </Form.Item>
          </Col>
          <Col offset={2} span={8}>
            <Button 
              disabled={!allowedSendCaptcha || !!waitingCaptcha} 
              onClick={handleSendCaptcha}
              block
            >
              {waitingCaptcha === -1 ? 
                t('发送中...') : 
                waitingCaptcha !== 0 ? 
                  t('{{waitingTime}} 秒后重新发送', { waitingTime: waitingCaptcha }) : 
                  t('获取验证码')}
            </Button>
          </Col>
        </Row>
      </Form.Item>
      <Button 
        className={'register-form-submit'}
        onClick={handleOnSubmit}
        type={'primary'}
        block
      >
        {t('立即注册')}
      </Button>
    </Form>
  )
}

export default RegisterForm;
