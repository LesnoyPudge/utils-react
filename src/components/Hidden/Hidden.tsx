import { FC } from 'react';
import { VisuallyHidden } from '@components/VisuallyHidden';



export namespace Hidden {
    export type Props = VisuallyHidden.Props;
}

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