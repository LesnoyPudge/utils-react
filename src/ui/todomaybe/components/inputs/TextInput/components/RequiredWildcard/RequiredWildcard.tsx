import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';




interface RequiredWildcard extends PropsWithClassName {
    hidden?: boolean;
}

const styles = {
    wildcard: 'text-color-error leading-none',
};

export const RequiredWildcard: FC<RequiredWildcard> = ({
    className = '',
    hidden = false,
}) => {
    return (
        <If condition={!hidden}>
            <span className={twClassNames(styles.wildcard, className)}>
                <>*</>
            </span>
        </If>
    );
};