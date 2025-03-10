import { FC, PropsWithChildren } from 'react';



export namespace AccessiblyHidden {
    export type Props = PropsWithChildren;
};

/**
 * Hides children from accessibility tree.
 */
export const AccessiblyHidden: FC<AccessiblyHidden.Props> = ({
    children,
}) => {
    return (
        <div aria-hidden>
            {children}
        </div>
    );
};