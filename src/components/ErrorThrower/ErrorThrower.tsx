import { FC } from 'react';



export namespace ErrorThrower {
    export type Props = {
        message?: string;
        options?: ErrorOptions;
    };
}

export const ErrorThrower: FC<ErrorThrower.Props> = ({
    message = 'ErrorThrower',
    options,
}) => {
    throw new Error(message, options);
};