import { useFunction } from '@hooks/useFunction';
import { useLayoutEffect } from 'react';
import { useRefManager } from '@entities/RefManager';



export namespace useMoveFocusAt {
    export type Args = [
        elementRef: useRefManager.RefManager<HTMLElement>,
        enabled: boolean,
    ];

    export type Return = {
        focus: VoidFunction;
    };
}

const options: FocusOptions = {
    preventScroll: false,
    // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#focusvisible
    focusVisible: true,
};

export const useMoveFocusAt = (...[
    elementRef,
    enabled,
]: useMoveFocusAt.Args): useMoveFocusAt.Return => {
    const focus = useFunction(() => {
        if (!elementRef.current) return;

        elementRef.current.focus(options);
    });

    useLayoutEffect(() => {
        if (!enabled) return;

        return elementRef.effect((node) => {
            node.focus(options);
        });
    });

    return {
        focus,
    };
};