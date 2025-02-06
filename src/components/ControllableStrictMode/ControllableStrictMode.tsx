import { FC, PropsWithChildren, StrictMode as ReactStrictMode } from 'react';



export namespace ControllableStrictMode {
    export type Props = (
        PropsWithChildren
        & {
            isEnabled: boolean;
        }
    );
}

/**
 * Allows to toggle React.StrictMode
 */
export const ControllableStrictMode: FC<ControllableStrictMode.Props> = ({
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