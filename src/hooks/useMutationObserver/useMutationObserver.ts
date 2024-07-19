import { useFunction, useRefCallback } from '@hooks';
import { SharedMutationObserver } from '@lesnoypudge/utils';



const observer = new SharedMutationObserver();

export const useMutationObserver = (
    callback: (record: MutationRecord) => void,
    options?: MutationObserverInit,
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