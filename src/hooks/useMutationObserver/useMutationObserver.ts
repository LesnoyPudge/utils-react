import { useFunction } from '@hooks/useFunction';
import { SharedMutationObserver } from '@lesnoypudge/utils-web';
import { useLayoutEffect } from 'react';
import { useRefManager } from '@entities/RefManager';
import { useMemoDeep } from '@hooks/useMemoDeep';
import { T } from '@lesnoypudge/types-utils-base/namespace';



const observer = new SharedMutationObserver();

export namespace useMutationObserver {
    type RequiredOptions = T.RequireAtLeastOne<Pick<
        MutationObserverInit,
        'attributes' | 'childList' | 'characterData'
    >>;

    export type Options = (
        RequiredOptions
        & T.Except<MutationObserverInit, keyof RequiredOptions>
    );
}

/**
 * Tracks mutations on the given element and executes the provided
 * callback when changes occur.
 */
export const useMutationObserver = (
    elementRef: useRefManager.RefManager<HTMLElement>,
    callback: (record: MutationRecord) => void,
    options: useMutationObserver.Options,
) => {
    const _callback = useFunction(callback);
    const _options = useMemoDeep(options);

    useLayoutEffect(() => {
        return elementRef.effect((node) => {
            observer.observe(node, _callback, _options);

            return () => {
                observer.unobserve(node, _callback);
            };
        });
    }, [_callback, _options, elementRef]);
};