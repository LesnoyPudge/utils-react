import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import React, { FC } from 'react';



export interface FileInput extends PropsWithChildrenAndClassName {
    name: string;
    accept?: string;
    multiple?: boolean;
    label: string;
    hidden?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const styles = {
    wrapper: 'block relative focus-within:focused',
    input: 'sr-input focus-hidden',
};

export const FileInput: FC<FileInput> = ({
    className = '',
    label,
    name,
    accept = '',
    multiple = false,
    hidden = false,
    children,
    onChange,
}) => {
    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <input
                className={styles.input}
                accept={accept}
                multiple={multiple}
                type='file'
                name={name}
                tabIndex={hidden ? -1 : 0}
                aria-hidden={hidden}
                aria-label={label}
                onChange={onChange}
            />

            {children}
        </div>
    );
};