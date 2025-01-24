import { useFunction } from '@hooks/useFunction';
import { SharedIntersectionObserver } from '@lesnoypudge/utils-web';
import { useLayoutEffect } from 'react';
import { useRefManager } from '@entities/RefManager';
import { useMemoDeep } from '@hooks/useMemoDeep';



const observer = new SharedIntersectionObserver();

/**
 * Tracks the intersection of an element with the viewport or another element.
 */
export const useIntersectionObserver = (
    elementRef: useRefManager.RefManager<HTMLElement>,
    callback: (entry: IntersectionObserverEntry) => void,
    options?: IntersectionObserverInit,
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