import { Result } from 'antd';

interface IProps { }

function NotFound (props: IProps) {
  return (
    <Result
      status={'404'}
      title={'404'}
      subTitle={'NOT FOUND'}
    />
  );
}

export default NotFound;
