import { useRefManager } from '@hooks/useRefManager';
import { useLayoutEffect } from 'react';
import { useAutoFocusable } from '../useAutoFocusable';
import { useFunction } from '@hooks/useFunction';
import { moveFocusInside } from '../../utils';


export namespace useMoveFocusInside {
    export type Options = {
        containerRef: useRefManager.NullableRefManager<HTMLElement>;
        isEnabled: boolean;
        preventScroll?: boolean;
    };

    export type Return = {
        moveFocusInside: () => boolean;
    };
}

export const useMoveFocusInside = ({
    containerRef,
    isEnabled,
    preventScroll,
}: useMoveFocusInside.Options): useMoveFocusInside.Return => {
    useAutoFocusable(isEnabled, containerRef);

    const _moveFocusInside = useFunction((): boolean => {
        return moveFocusInside(containerRef.current, {
            preventScroll,
        });
    });

    // https://github.com/theKashey/react-focus-lock/blob/master/src/MoveFocusInside.js#L7
    useLayoutEffect(() => {
        if (!isEnabled) return;

        return containerRef.effect(() => {
            _moveFocusInside();
        });
    }, [containerRef, isEnabled, _moveFocusInside]);

    return {
        moveFocusInside: _moveFocusInside,
    };
};