import {
    useFunction,
    useLatest,
    useUniqueState,
    useUnmountEffect,
} from '@hooks';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useRef } from 'react';



export namespace useDebounce {
    export type Options = {
        /**
         * Disable state updating.
         * Ref will keep updating.
         */
        stateless?: boolean;
    };
}

/**
 * Callback aren't called when component is unmounted;
 */
export const useDebounce = (options: useDebounce.Options = {}) => {
    const [isDebouncing, setIsDebouncing] = useUniqueState(false);
    const isDebouncingRef = useRef(isDebouncing);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const lastOptionsRef = useLatest(options);

    const debounce = useFunction(<
        _Callback extends T.AnyFunction,
    >(
        callback: _Callback,
        delay: number,
    ) => {
        return (...args: Parameters<_Callback>) => {
            clearTimeout(timeoutRef.current);
            !lastOptionsRef.current.stateless && setIsDebouncing(true);
            isDebouncingRef.current = true;

            timeoutRef.current = setTimeout(() => {
                callback(...args);
                !lastOptionsRef.current.stateless && setIsDebouncing(false);
                isDebouncingRef.current = true;
            }, delay);
        };
    });

    useUnmountEffect(() => {
        clearTimeout(timeoutRef.current);
    });

    return {
        isDebouncing,
        isDebouncingRef,
        debounce,
    };
};