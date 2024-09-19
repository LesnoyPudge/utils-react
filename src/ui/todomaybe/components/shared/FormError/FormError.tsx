
import { SerializedError } from '@reduxjs/toolkit';
import { CustomQueryError, PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import isObject from 'is-object';
import { FC } from 'react';



interface FormError extends PropsWithClassName {
    error: CustomQueryError | SerializedError | undefined;
}

const isCustomQueryError = (
    error: unknown,
): error is CustomQueryError => {
    return isObject(error) && 'status' in error;
};

const styles = {
    wrapper: 'bg-danger text-white font-semibold p-2 rounded-md',
};

const unexpected = 'Непредвиденная ошибка';

export const FormError: FC<FormError> = ({
    className = '',
    error,
}) => {
    const errorText = (
        error
            ? isCustomQueryError(error)
                ? typeof error.status === 'number'
                    ? error.data.message
                    : unexpected
                : unexpected
            : null
    );

    return (
        <If condition={!!errorText}>
            <div
                className={twClassNames(styles.wrapper, className)}
                aria-live='polite'
            >
                {errorText}
            </div>
        </If>
    );
};