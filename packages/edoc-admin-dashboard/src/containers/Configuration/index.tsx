import { useTranslation } from 'react-i18next';
import { PageHeader, Form, Input, Row, Col, Select, Button } from 'antd';

import { SendOutlined, ClearOutlined } from '@ant-design/icons';

import './index.scss';

interface IProps {

}

function Configuration(props: IProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  return (
    <div className={'content-container configuration'}>
      <PageHeader
        title={t('定时任务配置')}
        subTitle={t('进行动态配置完成定时任务的创建。无需接入定时调度系统或手写代码即可完成对数据文本的定时持久化操作')}
        ghost={false}
        className={'configuration-title'}
      />
      <Form labelCol={{ span: 6 }} form={form}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name={'topic'} label={t('发送目标 Topic')}>
              <Select placeholder={t('请选择 Topic')}>
                <Select.OptGroup label={t('中心正式机房 - HZ')}>
                  <Select.Option value={'QUEUE_EnhanceTimer'}>{t('持久化 Topic')}</Select.Option>
                  <Select.Option value={'QUEUE_EnhanceTimer_delay'}>{t('延时持久化 Topic')}</Select.Option>
                  <Select.Option value={'QUEUE_EnhanceTimer_without_delay'}>{t('非延时持久化 Topic')}</Select.Option>
                </Select.OptGroup>
                <Select.OptGroup label={t('中心预发机房 - HZ')}>
                  <Select.Option value={'QUEUE_EnhanceTimer_pre'} disabled>{t('持久化 Topic')}</Select.Option>
                </Select.OptGroup>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={'resource'} label={t('文本来源')}>
              <Select placeholder={t('请选择文本来源')}>
                <Select.Option value={'db'}>{t('数据库')}</Select.Option>
                <Select.Option value={'oss'}>{t('对象存储')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={t('文案版本')} name={'version'}>
              <Input placeholder={t('请输入文案版本')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={'type'} label={t('文案操作类型')}>
              <Select placeholder={t('请选择操作类型')}>
                <Select.Option value={'deploy'}>{t('发布文案')}</Select.Option>
                <Select.Option value={'update'}>{t('更新文案')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name={'callbackType'} label={t('回调时间')}>
              <Select placeholder={t('请选择回调时间')}>
                <Select.OptGroup label={t('单次回调')}>
                  <Select.Option value={'zero_o_clock'}>{t('凌晨 0 点')}</Select.Option>
                  <Select.Option value={'twelve_o_clock'} disabled>{t('中午 12 点')}</Select.Option>
                </Select.OptGroup>
                <Select.OptGroup label={t('周期回调')}>
                  <Select.Option value={'each_half_day'} disabled>{t('每半天')}</Select.Option>
                  <Select.Option value={'each_three_days'} disabled>{t('每三天')}</Select.Option>
                  <Select.Option value={'each_week'} disabled>{t('每周')}</Select.Option>
                </Select.OptGroup>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <div className={'configuration-buttons'}>
          <Button icon={<ClearOutlined />}>{t('清空配置')}</Button>
          <Button type={'primary'} icon={<SendOutlined />}>{t('确认创建')}</Button>
        </div>
      </Form>
    </div>
  );
}

export default Configuration;
