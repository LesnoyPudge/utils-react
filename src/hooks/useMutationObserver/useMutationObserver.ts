import { useFunction, useLatest } from '@hooks';
import { RefObject, useEffect } from 'react';



// links regarding shared functionality of observer
// https://github.com/whatwg/dom/issues/126
// https://github.com/microsoft/fast/blob/d38d31d2dd7496b5eb1e7c65b57de9a5e05e8546/packages/web-components/fast-element/src/utilities.ts#L91

export const useMutationObserver = (
    elementRef: RefObject<HTMLElement>,
    callback: MutationCallback,
    options?: MutationObserverInit,
) => {
    const _callback = useFunction(callback);
    const optionsRef = useLatest(options);

    useEffect(() => {
        if (!elementRef.current) return;

        const observer = new MutationObserver(_callback);

        observer.observe(elementRef.current, optionsRef.current);

        return () => {
            observer.disconnect();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};