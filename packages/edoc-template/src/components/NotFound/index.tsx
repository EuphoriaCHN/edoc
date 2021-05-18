import { Result } from 'antd';
import { useTranslation } from 'react-i18next';

interface IProps { }

function NotFound (props: IProps) {
  const { t } = useTranslation();

  return (
    <Result
      status={'404'}
      title={'404'}
      subTitle={t('页面走丢了')}
    />
  );
}

export default NotFound;
