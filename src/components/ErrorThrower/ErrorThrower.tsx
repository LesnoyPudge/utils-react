import { FC } from 'react';



export namespace ErrorThrower {
    export type Props = {
        message?: string;
        disable?: boolean;
        cause?: string;
    };
}

/**
 * Throws error on render.
 */
export const ErrorThrower: FC<ErrorThrower.Props> = ({
    message = 'ErrorThrower',
    disable = false,
    cause,
}) => {
    if (!disable) {
        throw new Error(message, { cause });
    }

    return null;
};