import { useFunction, useRefCallback } from '@hooks';
import { SharedResizeObserver } from '@lesnoypudge/utils';



const observer = new SharedResizeObserver();

export const useResizeObserver = (
    callback: (entry: ResizeObserverEntry) => void,
    options?: ResizeObserverOptions,
) => {
    const _callback = useFunction(callback);

    const elementRefCallback = useRefCallback<HTMLElement>((element) => {
        observer.observe(element, _callback, options);

        return () => {
            observer.unobserve(element, _callback);
        };
    });

    return elementRefCallback;
};