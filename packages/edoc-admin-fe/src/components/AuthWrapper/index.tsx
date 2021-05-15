import * as React from 'react';

import { useSelector } from 'react-redux';
import { Store } from '@/store';

import Forbidden from '@/containers/Forbidden';

export default function AuthWrapper<T extends object = {}>(Component: React.ComponentType<T>) {
  function HOC(props: T) {
    const globalStore = useSelector<Store, Store['global']>(state => state.global);

    if (globalStore.forbidden) {
        return <Forbidden />;
    }

    return <Component {...props} />
  }

  return HOC;
}