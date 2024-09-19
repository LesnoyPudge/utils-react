import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const styles = {
    wrapper: 'flex shrink-0 w-6 h-6 p-1 rounded-full border-2 border-current',
    inner: {
        base: 'm-auto w-full h-full scale-0 rounded-full bg-current transition-all',
        active: 'scale-100',
    },
};

interface RadioInputIndicator extends PropsWithClassName {
    checked: boolean;
}

export const RadioInputIndicator: FC<RadioInputIndicator> = ({
    className = '',
    checked,
}) => {
    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <div 
                className={twClassNames(
                    styles.inner.base, 
                    { [styles.inner.active]: checked },
                )}
            ></div>
        </div>
    );
};