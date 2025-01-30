import { useBoolean } from '@hooks/useBoolean';
import { useFunction } from '@hooks/useFunction';
import { useLatest } from '@hooks/useLatest';
import { useUnmountEffect } from '@hooks/useUnmountEffect';
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
 * Provides a debounced function with the option to track debouncing state.
 */
export const useDebounce = (options: useDebounce.Options = {}) => {
    const debounceState = useBoolean(false);
    const isDebouncingRef = useRef(debounceState.value);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const lastOptionsRef = useLatest(options);
    const shouldUpdateState = !lastOptionsRef.current.stateless;

    const debounce = useFunction(<
        _Callback extends T.AnyFunction,
    >(
        callback: _Callback,
        delay: number,
    ) => {
        return (...args: Parameters<_Callback>) => {
            clearTimeout(timeoutRef.current);

            isDebouncingRef.current = true;
            shouldUpdateState && debounceState.setTrue();

            timeoutRef.current = setTimeout(() => {
                callback(...args);

                isDebouncingRef.current = false;
                shouldUpdateState && debounceState.setFalse();
            }, delay);
        };
    });

    useUnmountEffect(() => {
        clearTimeout(timeoutRef.current);
    });

    return {
        isDebouncing: debounceState.value,
        isDebouncingRef,
        debounce,
    };
};