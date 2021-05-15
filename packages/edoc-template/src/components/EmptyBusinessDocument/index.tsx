import { Result } from 'antd';
import { useTranslation } from 'react-i18next';

interface IProps { }

function EmptyBusinessDocument (props: IProps) {
  const { t } = useTranslation();

  return (
    <Result
      status={'404'}
      title={t('空分类')}
      subTitle={t('这个页面库还没有任何发布文档哦')}
    />
  );
}

export default EmptyBusinessDocument;
