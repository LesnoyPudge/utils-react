import { FC } from 'react';
import { useMoveFocusInside } from './hooks';
import { useRefManager } from '@entities/RefManager';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';
import { FocusContext } from '@entities/MoveFocus/context';



export namespace MoveFocusInside {
    type WithContainerRef = {
        containerRef: useMoveFocusInside.Args[0];
    };

    type ChildrenProps = T.Simplify<(
        WithContainerRef
        & Pick<useMoveFocusInside.Return, 'moveFocusInside'>
    )>;

    export type Props = T.Simplify<(
        RT.PropsWithRenderFunctionOrNode<[ChildrenProps]>
        & Partial<WithContainerRef>
        & useMoveFocusInside.Options
    )>;
}

export const MoveFocusInside: FC<MoveFocusInside.Props> = ({
    containerRef,
    children,
    ...options
}) => {
    const refManager = useRefManager<HTMLElement>(null);
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