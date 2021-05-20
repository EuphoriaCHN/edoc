import React from 'react';
import { Layout as AntDLayout } from 'antd';

import Footer from '@/components/Footer';

function Layout(props: React.PropsWithChildren<{}>) {   
    return (
        <AntDLayout>
            <AntDLayout.Content>
                {props.children}
            </AntDLayout.Content>
            <Footer />
        </AntDLayout>
    );
}

export default Layout;
