import React, { FC, PropsWithChildren } from 'react';



export namespace StrictMode {
    export type Props = (
        PropsWithChildren
        & {
            isEnabled: boolean;
        }
    );
}

export const StrictMode: FC<StrictMode.Props> = ({
    isEnabled,
    children,
}) => {
    if (isEnabled) {
        return (
            <React.StrictMode>
                {children}
            </React.StrictMode>
        );
    }

    return children;
};