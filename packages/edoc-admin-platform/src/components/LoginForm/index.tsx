import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button, Tabs, Input, Row, Col, message, Tooltip } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, AlipayOutlined } from '@ant-design/icons';
import { debounce } from 'lodash-es';
import isMobilePhone from 'validator/es/lib/isMobilePhone';
import Cookie from 'js-cookie';
import { useHistory } from 'umi';

import { LoginAPI } from '@/api';

import { REGEXPS } from '@/components/RegisterForm';

import './index.scss';

interface IProps {

}

const CAPTCHA_WAITING_TIME = 10;

function LoginForm(this: any, props: IProps) {
  const [allowedSendCaptcha, setAllowedSendCaptcha] = React.useState<boolean>(false);
  const [waitingCaptcha, setWaitingCaptcha] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { t, i18n } = useTranslation();
  const _history = useHistory();

  const [form] = Form.useForm();

  /**
   * Check 手机号
   */
  const handleOnPhoneChangeDebounced = React.useCallback(debounce((data: string) => {
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

  const handleOnFormInputItemChange = React.useCallback((debouncedFunc: ReturnType<typeof debounce>, event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedFunc(event.target.value);
  }, []);

  /**
   * 发送手机验证码
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
      return setTimeout(function () {
        count -= 1;
        setWaitingCaptcha(count);
        if (!!count) {
          return timer();
        }
      }, 1000);
    }

    timer();
  }, []);

  /**
   * 提交【账号登陆】
   */
  const handelSubmitLoginByAccount = React.useCallback(async () => {
    const { account, password } = form.getFieldsValue(['account', 'password']);

    let flag = true;

    if (!account) {
      form.setFields([{ name: 'account', errors: [t('此项是必填项')] }]);
      flag = false;
    } else if (!REGEXPS.account.test(account)) {
      form.setFields([{ name: 'account', errors: [t('账号仅能由 3 到 16 位数字、字母与下划线组成')] }]);
      flag = false;
    }

    if (!password) {
      form.setFields([{ name: 'password', errors: [t('此项是必填项')] }]);
      flag = false;
    } else if (!REGEXPS.password.test(account)) {
      form.setFields([{ name: 'password', errors: [t('密码仅能由 6 到 16 位数字、字母及特殊字符组成')] }]);
      flag = false;
    }

    if (!flag) {
      return;
    }

    setLoading(true);
    try {
      const { data } = await LoginAPI.accountLogin({ account, password });
      message.success(t('登录成功'));

      const { headerValue } = data;
      // LocalStorage
      Cookie.set(AUTHORIZATION_KEY, headerValue, { expires: 1 });
      _history.push('/');
    } catch (err) {
      message.error(err.message || JSON.stringify(err));
      message.error(t('登录失败'));
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 提交【短信验证码登录】
   */
  const handleSubmitLoginByCaptcha = React.useCallback(async () => { }, []);

  /**
   * 支付宝扫码登陆
   */
  const handleRedirectAliPayScanQRCode = React.useCallback(() => {
    window.open(
      'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021002144604032&scope=auth_user&redirect_uri=http%3A%2F%2Fedoc.bhj-noshampoo.site%2FAliPayLogin%3FredirectBase%3Dhome',
      '_self'
    );
  }, []);

  return (
    <div className={'login-form'}>
      <Form labelCol={{ span: i18n.language.startsWith('zh') ? 4 : 6 }} form={form}>
        <Tabs defaultActiveKey={'useAccount'}>
          <Tabs.TabPane tab={t('账号登录')} key={'useAccount'}>
            <Form.Item name={'account'} label={t('账号')}>
              <Input allowClear />
            </Form.Item>
            <Form.Item name={'password'} label={t('密码')}>
              <Input.Password
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                allowClear
              />
            </Form.Item>
            <Button loading={loading} onClick={handelSubmitLoginByAccount} type={'primary'} block>{t('登录')}</Button>
          </Tabs.TabPane>
          <Tabs.TabPane tab={t('短信验证码登录')} key={'usePhone'}>
            <Form.Item name={'phoneNumber'} label={t('手机号')}>
              <Input
                onChange={handleOnFormInputItemChange.bind(this, handleOnPhoneChangeDebounced)}
                allowClear
              />
            </Form.Item>
            <Form.Item
              label={t('验证码')}
              extra={t('我们必须确保这不是计算机在操作')}
            >
              <Row gutter={16}>
                <Col span={10}>
                  <Form.Item
                    name={'captcha'}
                    noStyle
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col offset={2} span={12}>
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
            <Button loading={loading} type={'primary'} block>{t('登录')}</Button>
          </Tabs.TabPane>
        </Tabs>
      </Form>
      <Tooltip title={t('支付宝扫码登陆')}>
        <div className={'alipay-box'} onClick={handleRedirectAliPayScanQRCode}>
          <div className={'alipay-box-inner'}>
            <AlipayOutlined className={'alipay-box-inner-icon'} />
            <div className={'alipay-box-inner-mask'} />
          </div>
        </div>
      </Tooltip>
    </div>
  )
}

export default LoginForm;
