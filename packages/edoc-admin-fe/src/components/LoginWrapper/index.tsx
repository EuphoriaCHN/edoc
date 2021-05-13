import * as React from 'react';
import Cookie from 'js-cookie';
import { LoginAPI } from '@/api';
import { message } from 'antd';
import { useHistory, useLocation } from 'umi';

import Loading from '@/containers/Loading';
import Login from '@/components/Login';

import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { setUser } from '@/store/UserStore';

export default function LoginWrapper<T>(Component: React.ComponentType<T>) {
  function HOC(props: T) {
    const [logged, setLogged] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    const _dispatch = useDispatch();
    const _history = useHistory();
    const _location = useLocation();

    const checkLoginStatus = React.useCallback(async () => {
      setLoading(true);
      setLogged(false);

      try {
        const authorizationValue = Cookie.get(AUTHORIZATION_KEY);

        if (!authorizationValue) {
          _location.pathname !== '/' && _history.replace('/');
          return;
        }

        const { data } = await LoginAPI.getLoginInfo();
        const { headerValue, extraMsg, loginSuccess } = data;

        if (!loginSuccess) {
          _location.pathname !== '/' && _history.replace('/');
          return
        }

        Cookie.set(AUTHORIZATION_KEY, headerValue, { expires: 1 });
        _dispatch(setUser({
          id: nanoid(),
          user: extraMsg
        }));

        setLogged(true);
      } catch (err) {
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    }, []);

    React.useEffect(() => {
      checkLoginStatus();
    }, []);

    if (loading) {
      return <Loading />
    }

    if (logged) {
      return <Component {...props} />
    }

    return <Login {...props} />;
  }

  return HOC;
}