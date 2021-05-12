import * as React from 'react';
import Login from '@/components/Login';

export default function LoginWrapper<T extends any>(Component: React.ComponentType<T>) {
    function HOC(props: T) {
        return <Login {...props} />
    }

    return HOC;
}