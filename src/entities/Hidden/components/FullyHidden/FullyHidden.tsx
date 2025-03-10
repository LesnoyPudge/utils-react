import { srOnlyStyles } from '../../styles';
import { FC, PropsWithChildren } from 'react';



export namespace Hidden {
    export type Props = PropsWithChildren;
}

/**
 * Makes children visually and accessibly hidden.
 */
export const FullyHidden: FC<Hidden.Props> = ({
    children,
}) => {
    return (
        <div
            aria-hidden
            style={srOnlyStyles}
        >
            {children}
        </div>
    );
};