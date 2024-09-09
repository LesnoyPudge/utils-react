import { FC } from 'react';
import { useMoveFocusInside, useRefManager } from '@entities';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils';



export namespace MoveFocusInside {
    type WithContainerRef = {
        containerRef: useMoveFocusInside.Args[0];
    };

    type ChildrenProps = T.Simplify<(
        WithContainerRef
        & useMoveFocusInside.Return
    )>;

    export type Props = T.Simplify<(
        RT.PropsWithRenderFunctionOrNode<[ChildrenProps]>
        & Partial<WithContainerRef>
        & useMoveFocusInside.Args[1]
    )>;
}

export const MoveFocusInside: FC<MoveFocusInside.Props> = ({
    children,
    containerRef,
    enabled,
    forced,
}) => {
    const refManager = useRefManager<HTMLElement>(null);
    const manager = containerRef ?? refManager;

    const { moveFocusInside } = useMoveFocusInside(manager, {
        enabled,
        forced,
    });

    return renderFunction(children, {
        moveFocusInside,
        containerRef: manager,
    });
};