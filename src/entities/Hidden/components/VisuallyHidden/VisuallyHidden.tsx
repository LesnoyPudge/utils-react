import { srOnlyStyles } from '../../styles';
import { FC, PropsWithChildren } from 'react';



export namespace VisuallyHidden {
    export type Props = PropsWithChildren;
}

/**
 * Visually hides provided children.
 */
export const VisuallyHidden: FC<VisuallyHidden.Props> = ({
    children,
}) => {
    return (
        <div style={srOnlyStyles}>
            {children}
        </div>
    );
};