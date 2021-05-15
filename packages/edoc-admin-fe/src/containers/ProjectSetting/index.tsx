import * as React from 'react';
import { useTranslation } from 'react-i18next';

import './index.scss';

interface IProps {

}

function ProjectSetting(props: IProps) {
    const { t } = useTranslation();

    const elementRef = React.createRef<HTMLHeadingElement>();

    React.useEffect(() => {
        // DOM 节点
        console.log(elementRef.current);
    }, []);

    return <h1 ref={elementRef}>ProjectSetting</h1>
}

export default ProjectSetting;
