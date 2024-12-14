import { renderFunction } from '@utils/renderFunction';
import { FC } from 'react';
import { useMoveFocusAt } from './hooks';
import { useRefManager } from '@entities/RefManager';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { FocusContext } from '../../context';



export namespace MoveFocusAt {
    type WithElementRef = {
        elementRef: useMoveFocusAt.Args[0];
    };

    type RenderProps = (
        {
            focus: VoidFunction;
        }
        & WithElementRef
    );

    type WithChildren = RT.PropsWithRequiredRenderFunction<[RenderProps]>;

    export type Props = (
        useMoveFocusAt.Options
        & Partial<WithElementRef>
        & WithChildren
    );
}

export const MoveFocusAt: FC<MoveFocusAt.Props> = ({
    elementRef,
    children,
    ...options
}) => {
    const refManager = useRefManager<HTMLElement>(null);
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