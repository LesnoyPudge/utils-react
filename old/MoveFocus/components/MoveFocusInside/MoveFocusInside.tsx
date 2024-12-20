import { useMoveFocusInside } from './hooks';
import { useRefManager } from '@entities/RefManager';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';
import { FocusContext } from '@entities/MoveFocus/context';



export namespace MoveFocusInside {
    type WithContainerRef<_Element extends HTMLElement> = {
        containerRef: useRefManager.RefManager<_Element>;
    };

    type ChildrenProps<_Element extends HTMLElement> = T.Simplify<(
        WithContainerRef<_Element>
        & Pick<useMoveFocusInside.Return, 'moveFocusInside'>
    )>;

    export type Props<_Element extends HTMLElement> = T.Simplify<(
        RT.PropsWithRenderFunctionOrNode<[ChildrenProps<_Element>]>
        & Partial<WithContainerRef<_Element>>
        & useMoveFocusInside.Options
    )>;
}

export const MoveFocusInside = <_Element extends HTMLElement>({
    containerRef,
    children,
    ...options
}: MoveFocusInside.Props<_Element>) => {
    const refManager = useRefManager<_Element>(null);
    const manager = containerRef ?? refManager;

    const {
        moveFocusInside,
        focusMap,
        focusQueue,
    } = useMoveFocusInside(manager, options);

    const contextValue: FocusContext = {
        focusMap,
        focusQueue,
    };

    return (
        <FocusContext.Provider value={contextValue}>
            {renderFunction(children, {
                moveFocusInside,
                containerRef: manager,
            })}
        </FocusContext.Provider>
    );
};