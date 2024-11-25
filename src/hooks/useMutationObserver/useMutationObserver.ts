import { useFunction, useMemoShallow } from '@hooks';
import { SharedMutationObserver } from '@lesnoypudge/utils-web';
import { useLayoutEffect } from 'react';
import { useRefManager } from '@entities';



const observer = new SharedMutationObserver();

export const useMutationObserver = (
    elementRef: useRefManager.RefManager<HTMLElement>,
    callback: (record: MutationRecord) => void,
    options?: MutationObserverInit,
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