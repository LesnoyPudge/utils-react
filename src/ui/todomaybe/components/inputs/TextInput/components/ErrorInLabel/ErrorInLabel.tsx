import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';




interface ErrorInLabel extends PropsWithClassName {
    error: string | undefined;
}

const styles = {
    error: 'text-xs w-full text-color-error normal-case',
};

export const ErrorInLabel: FC<ErrorInLabel> = ({
    className = '',
    error,
}) => {
    return (
        <If condition={!!error}>
            <span className={twClassNames(styles.error, className)}>
                <> &#8722; </>

                {error}
            </span>
        </If>
    );
};