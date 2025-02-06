import { FC } from 'react';
import { VisuallyHidden } from '@components/VisuallyHidden';



export namespace Hidden {
    export type Props = VisuallyHidden.Props;
}

/**
 * Makes children visually and accessibly hidden.
 */
export const Hidden: FC<Hidden.Props> = ({
    children,
    ...rest
}) => {
    return (
        <VisuallyHidden
            aria-hidden
            {...rest}
        >
            {children}
        </VisuallyHidden>
    );
};