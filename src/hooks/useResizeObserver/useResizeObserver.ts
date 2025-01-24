import { useFunction } from '@hooks/useFunction';
import { SharedResizeObserver } from '@lesnoypudge/utils-web';
import { useLayoutEffect } from 'react';
import { useRefManager } from '@entities/RefManager';
import { useMemoDeep } from '@hooks/useMemoDeep';



const observer = new SharedResizeObserver();

export const useResizeObserver = (
    elementRef: useRefManager.RefManager<HTMLElement>,
    callback: (entry: ResizeObserverEntry) => void,
    options?: ResizeObserverOptions,
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