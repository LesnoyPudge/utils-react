import { useRefManager } from '@hooks/useRefManager';
import { useLayoutEffect } from 'react';
import { useAutoFocusable } from '../useAutoFocusable';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { moveFocusInside as moveFocusInsideLib, focusInside } from 'focus-lock';
import { useFunction } from '@hooks/useFunction';



export namespace useMoveFocusInside {
    export type Options = {
        containerRef: useRefManager.RefManager<HTMLElement>;
        isEnabled: boolean;
    };

    export type Return = {
        moveFocusInside: () => boolean;
    };
}

export const useMoveFocusInside = ({
    containerRef,
    isEnabled,
}: useMoveFocusInside.Options): useMoveFocusInside.Return => {
    useAutoFocusable(isEnabled, containerRef);

    const moveFocusInside = useFunction((): boolean => {
        if (!containerRef.current) return false;
        if (focusInside(containerRef.current)) return false;

        moveFocusInsideLib(
            containerRef.current,
            // @ts-expect-error null should(???) be valid arg https://github.com/theKashey/focus-lock/blob/master/src/focusSolver.ts#L30
            document.activeElement,
        );

        return true;
    });

    // https://github.com/theKashey/react-focus-lock/blob/master/src/MoveFocusInside.js#L7
    useLayoutEffect(() => {
        if (!isEnabled) return;

        return containerRef.effect(() => {
            moveFocusInside();
        });
    }, [containerRef, isEnabled, moveFocusInside]);

    return {
        moveFocusInside,
    };
};