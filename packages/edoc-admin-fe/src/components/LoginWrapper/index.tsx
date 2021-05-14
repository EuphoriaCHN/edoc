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

const IGNORED = [/\/AliPayLogin/];

export default function LoginWrapper<T>(Component: React.ComponentType<T>) {
  function HOC(props: T) {
    const [skipped, setSkipped] = React.useState<boolean>(false);
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
        Cookie.remove(AUTHORIZATION_KEY);
      } finally {
        setLoading(false);
      }
    }, []);

    React.useEffect(() => {
      for (const ignored of IGNORED) {
        if (ignored.test(_location.pathname)) {
          return setSkipped(true);
        }
      }
      checkLoginStatus();
    }, []);

    if (loading) {
      return <Loading />
    }

    if (logged || skipped) {
      return <Component {...props} />
    }

    return <Login {...props} />;
  }

  return HOC;
}