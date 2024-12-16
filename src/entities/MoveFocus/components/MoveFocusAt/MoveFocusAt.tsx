import { renderFunction } from '@utils/renderFunction';
import { useMoveFocusAt } from './hooks';
import { useRefManager } from '@entities/RefManager';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { FocusContext } from '../../context';



export namespace MoveFocusAt {
    type WithElementRef<_Element extends HTMLElement> = {
        elementRef: useRefManager.RefManager<_Element>;
    };

    type ChildrenProps<_Element extends HTMLElement> = (
        { focus: VoidFunction }
        & WithElementRef<_Element>
    );

    export type Props<_Element extends HTMLElement> = (
        useMoveFocusAt.Options
        & Partial<WithElementRef<_Element>>
        & RT.PropsWithRenderFunctionOrNode<[ChildrenProps<_Element>]>
    );
}

export const MoveFocusAt = <_Element extends HTMLElement>({
    elementRef,
    children,
    ...options
}: MoveFocusAt.Props<_Element>) => {
    const refManager = useRefManager<_Element>(null);
    const manager = elementRef ?? refManager;
    const {
        focus,
        focusMap,
        focusQueue,
    } = useMoveFocusAt(manager, options);

    const contextValue: FocusContext = {
        focusMap,
        focusQueue,
    };

    return (
        <FocusContext.Provider value={contextValue}>
            {renderFunction(children, {
                elementRef: manager,
                focus,
            })}
        </FocusContext.Provider>
    );
};