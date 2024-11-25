import { renderFunction } from '@utils/renderFunction';
import { FC } from 'react';
import { useScrollIntoView } from '@entities/ScrollIntoView';
import { useRefManager } from '@entities/RefManager';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { RT } from '@lesnoypudge/types-utils-react/namespace';



export namespace ScrollIntoView {
    type WithElementRef = {
        elementRef: useScrollIntoView.Args[0];
    };

    type ChildrenProps = T.Simplify<(
        WithElementRef
        & useScrollIntoView.Return
    )>;

    export type Props = T.Simplify<(
        RT.PropsWithRenderFunctionOrNode<[ChildrenProps]>
        & Partial<WithElementRef>
        & useScrollIntoView.Args[1]
    )>;
}

export const ScrollIntoView: FC<ScrollIntoView.Props> = ({
    children,
    elementRef,
    ...options
}) => {
    const refManager = useRefManager<HTMLElement>(null);
    const manager = elementRef ?? refManager;
    const { scrollIntoView } = useScrollIntoView(manager, options);

    return renderFunction(children, {
        scrollIntoView,
        elementRef: manager,
    });
};