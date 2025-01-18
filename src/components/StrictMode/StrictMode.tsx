import { FC, PropsWithChildren, StrictMode as ReactStrictMode } from 'react';



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
            <ReactStrictMode>
                {children}
            </ReactStrictMode>
        );
    }

    return children;
};