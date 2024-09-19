import { IMAGES } from '@generated';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



interface SpriteImage extends PropsWithClassName {
    name: keyof typeof IMAGES.SPRITE;
    style?: React.CSSProperties;
}

const styles = {
    base: 'flex shrink-0 transition-all w-full h-full',
};

export const SpriteImage: FC<SpriteImage> = ({
    className = '',
    name,
    style,
}) => {
    const id = `#${name}`;

    return (
        <svg className={twClassNames(styles.base, className)} style={style}>
            <use xlinkHref={id}/>
        </svg>
    );
};