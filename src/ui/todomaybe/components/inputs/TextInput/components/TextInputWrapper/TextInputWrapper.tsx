import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const styles = {
    wrapper: 'flex w-full h-10 bg-primary-500 rounded',
};

export const TextInputWrapper: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <div className={twClassNames(styles.wrapper, className)}>
            {children}
        </div>
    );
};