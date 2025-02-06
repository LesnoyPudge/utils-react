import { ComponentProps, FC } from 'react';



export namespace AccessiblyHidden {
    export type Props = ComponentProps<'div'>;
};

/**
 * Hides children from accessibility tree.
 */
export const AccessiblyHidden: FC<AccessiblyHidden.Props> = ({
    children,
    ...rest
}) => {
    return (
        <div
            aria-hidden
            {...rest}
        >
            {children}
        </div>
    );
};