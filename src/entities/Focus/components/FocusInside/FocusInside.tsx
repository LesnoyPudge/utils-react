import { useMoveFocusInside } from '../../hooks';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { PropsWithChildren } from 'react';



export namespace FocusInside {
    export type Options = useMoveFocusInside.Options;

    export type Props = T.Simplify<(
        PropsWithChildren
        & Options
    )>;
}

export const FocusInside = ({
    children,
    ...options
}: FocusInside.Props) => {
    useMoveFocusInside(options);

    return children;
};