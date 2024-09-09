import { useFunction, useLatest } from '@hooks';
import { useRefManager } from '@entities';
import { useLayoutEffect } from 'react';



export namespace useScrollIntoView {
    export type Options = {
        /**
         * @default 'instant'
         */
        behavior?: ScrollBehavior;
        /**
         * Alias for 'block'
         * @default 'center'
         */
        vertical?: ScrollLogicalPosition;
        /**
         * Alias for 'inline'
         * @default 'center'
         */
        horizontal?: ScrollLogicalPosition;
        /**
         * @default false;
         */
        enabled?: boolean;
    };

    export type Args = [
        elementRef: useRefManager.RefManager<HTMLElement>,
        options?: Options,
    ];

    export type Return = {
        scrollIntoView: VoidFunction;
    };
}

export const useScrollIntoView = (...[
    elementRef,
    options,
]: useScrollIntoView.Args): useScrollIntoView.Return => {
    const enabled = !!options?.enabled;
    const lastOptions = useLatest<ScrollIntoViewOptions>({
        behavior: options?.behavior ?? 'instant',
        block: options?.vertical ?? 'center',
        inline: options?.horizontal ?? 'center',
    });

    const scrollIntoView = useFunction(() => {
        const element = elementRef.current;
        if (!element) return;

        element.scrollIntoView(lastOptions.current);
    });

    useLayoutEffect(() => {
        if (!enabled) return;

        return elementRef.effect(() => {
            scrollIntoView();
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    return {
        scrollIntoView,
    };
};