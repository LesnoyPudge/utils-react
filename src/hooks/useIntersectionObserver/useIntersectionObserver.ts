import { useFunction, useRefCallback } from '@hooks';
import { SharedIntersectionObserver } from '@lesnoypudge/utils';



const observer = new SharedIntersectionObserver();

export const useIntersectionObserver = (
    callback: (entry: IntersectionObserverEntry) => void,
    options?: IntersectionObserverInit,
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