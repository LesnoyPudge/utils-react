import { useFunction } from '@hooks/useFunction';
import { useId, useLayoutEffect } from 'react';
import { useRefManager } from '@entities/RefManager';
import { FocusContext } from '../../../../context';
import { useFocusContext } from '../../../../hooks';



export namespace useMoveFocusAt {
    export type Options = {
        enabled: boolean;
    };

    export type Args = [
        elementRef: useRefManager.RefManager<HTMLElement>,
        options?: Options,
    ];

    export type Return = (
        FocusContext
        & {
            focus: VoidFunction;
        }
    );
}

const focusOptions: FocusOptions = {
    preventScroll: false,
    // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#focusvisible
    focusVisible: true,
};

export const useMoveFocusAt = (...[
    elementRef,
    options,
]: useMoveFocusAt.Args): useMoveFocusAt.Return => {
    const id = useId();
    const { focusMap, focusQueue } = useFocusContext();

    const removeId = useFunction(() => {
        focusQueue.current = focusQueue.current.filter((_id) => _id !== id);
    });

    const focus = useFunction(() => {
        if (!elementRef.current) return;

        elementRef.current.focus(focusOptions);
    });

    useLayoutEffect(() => {
        const {
            enabled = false,
        } = options ?? {};

        if (!enabled) return;

        return elementRef.effect((node) => {
            node.focus(focusOptions);
            focusQueue.current.push(id);

            return removeId;
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [!!options?.enabled]);

    return {
        focus,
        focusMap,
        focusQueue,
    };
};