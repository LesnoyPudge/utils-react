import { useFunction } from '@hooks/useFunction';
import { SharedResizeObserver } from '@lesnoypudge/utils-web';
import { useLayoutEffect } from 'react';
import { useRefManager } from '@hooks/useRefManager';
import { useMemoDeep } from '@hooks/useMemoDeep';



const observer = new SharedResizeObserver();

/**
 * Tracks changes to an element's size.
 * The callback is triggered when the element's size changes.
 */
export const useResizeObserver = (
    elementRef: useRefManager.NullableRefManager<HTMLElement>,
    callback: (entry: ResizeObserverEntry) => void,
    options?: ResizeObserverOptions,
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