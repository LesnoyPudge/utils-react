import { FC } from 'react';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';



const styles = {
    wrapper: `flex gap-1 justify-center items-center [&>*]:w-1.5 [&>*]:h-1.5 [&>*]:rounded-full 
    [&>*]:bg-white [&>*]:animate-loading-pulse [&>*:nth-child(2)]:animation-delay-200
    [&>*:nth-child(3)]:animation-delay-[400ms]`,
};

export const LoadingIndicator: FC<PropsWithClassName> = ({
    className = '',
}) => {
    return (
        <div
            className={twClassNames(styles.wrapper, className)}
            aria-label='Загрузка...'
            title='Загрузка...'
        >
            <div></div>

            <div></div>

            <div></div>
        </div>
    );
};