import { FC } from 'react';



export namespace ErrorThrower {
    export type Props = {
        message?: string;
        disable?: boolean;
        options?: ErrorOptions;
    };
}

export const ErrorThrower: FC<ErrorThrower.Props> = ({
    message = 'ErrorThrower',
    disable = false,
    options,
}) => {
    if (!disable) {
        throw new Error(message, options);
    }

    return null;
};