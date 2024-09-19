import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



interface FieldLabel extends PropsWithChildrenAndClassName {
    htmlFor?: string;
}

const styles = {
    label: 'block text-xs mb-2 text-color-secondary uppercase font-bold',
};

export const FieldLabel: FC<FieldLabel> = ({
    className = '',
    htmlFor,
    children,
}) => {
    return (
        <label
            className={twClassNames(styles.label, className)}
            htmlFor={htmlFor}
        >
            {children}
        </label>
    );
};