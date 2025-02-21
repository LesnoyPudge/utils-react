import { useFunction } from '@hooks/useFunction';
import { SharedMutationObserver } from '@lesnoypudge/utils-web';
import { useLayoutEffect } from 'react';
import { useRefManager } from '@hooks/useRefManager';
import { useMemoDeep } from '@hooks/useMemoDeep';



const observer = new SharedMutationObserver();

export namespace useMutationObserver {
    export type Options = SharedMutationObserver.Options;
}

/**
 * Tracks mutations on the given element and executes the provided
 * callback when changes occur.
 */
export const useMutationObserver = (
    elementRef: useRefManager.NullableRefManager<HTMLElement>,
    callback: SharedMutationObserver.StoreCallback,
    options: useMutationObserver.Options,
) => {
    const _callback = useFunction(callback);
    const _options = useMemoDeep(options);

    useLayoutEffect(() => {
        return elementRef.effect((node) => {
            if (!node) return;

            observer.observe(node, _callback, _options);

            return () => {
                observer.unobserve(node, _callback);
            };
        });
    }, [_callback, _options, elementRef]);
};