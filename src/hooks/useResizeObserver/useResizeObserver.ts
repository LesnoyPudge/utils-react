import { useFunction, useMemoShallow } from '@hooks';
import { SharedResizeObserver } from '@lesnoypudge/utils-web';
import { useLayoutEffect } from 'react';
import { useRefManager } from '@entities';



const observer = new SharedResizeObserver();

export const useResizeObserver = (
    elementRef: useRefManager.RefManager<HTMLElement>,
    callback: (entry: ResizeObserverEntry) => void,
    options?: ResizeObserverOptions,
) => {
    const _callback = useFunction(callback);
    const _options = useMemoShallow(options);

    useLayoutEffect(() => {
        return elementRef.effect((node) => {
            observer.observe(node, _callback, _options);

            return () => {
                observer.unobserve(node, _callback);
            };
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_options]);
};