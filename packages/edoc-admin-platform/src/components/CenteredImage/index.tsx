import * as React from 'react';

interface IProps {
    src: string;
    height?: number | string;
    width?: number | string;
}

function CenteredImage(props: IProps) {
    const [width, setWidth] = React.useState<number | undefined | string>(props.width);
    const [height, setHeight] = React.useState<number | undefined | string>(props.height);

    const handleOnImageLoaded = React.useCallback<React.ReactEventHandler<HTMLImageElement>>(event => {
        const target = event.target as HTMLImageElement;

        const { naturalHeight, naturalWidth } = target;

        if (naturalHeight > naturalWidth) {
            // 瘦高
            setWidth(undefined);
            setHeight('100%');
        } else {
            // 胖宽
            setHeight(undefined);
            setWidth('100%');
        }
    }, []);

    return <img src={props.src} width={width} height={height} onLoad={handleOnImageLoaded} />
}

export default CenteredImage;
