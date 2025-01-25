import { useRef, useState } from 'react';
import { useFunction } from '@hooks/useFunction';
import { useLatest } from '@hooks/useLatest';
import { useUnmountEffect } from '@hooks/useUnmountEffect';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { noop } from '@lesnoypudge/utils';


export namespace useThrottle {
    export type Options = {
        /**
         * Disable state updating.
         * Ref will keep updating.
         *
         * @default false
         */
        stateless?: boolean;
    };
}

/**
 * Controls the rate at which a function can be called, limiting it to a
 * certain frequency, while tracking the throttling state.
 */
export const useThrottle = (options: useThrottle.Options = {}) => {
    const [isThrottling, setIsThrottling] = useState(false);
    const isThrottlingRef = useRef(isThrottling);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const isCalledDuringThrottleRef = useRef(false);
    const lastArgsRef = useRef<unknown>();
    const lastFunctionRef = useRef<T.AnyFunction>(noop);
    const lastOptionsRef = useLatest(options);
    const shouldUpdateState = !lastOptionsRef.current.stateless;

    const throttle = useFunction(<
        _Callback extends T.AnyFunction,
    >(
        callback: _Callback,
        delay: number,
    ) => {
        lastFunctionRef.current = callback;

        const throttleWork = (...args: Parameters<_Callback>) => {
            lastFunctionRef.current(...args);
            shouldUpdateState && setIsThrottling(true);
            isThrottlingRef.current = true;

            timeoutRef.current = setTimeout(() => {
                if (!isCalledDuringThrottleRef.current) {
                    shouldUpdateState && setIsThrottling(false);
                    isThrottlingRef.current = false;
                    return;
                }

                throttleWork(...lastArgsRef.current as Parameters<_Callback>);
                isCalledDuringThrottleRef.current = false;
                lastArgsRef.current = null;
            }, delay);
        };

        return (...args: Parameters<_Callback>) => {
            if (isThrottlingRef.current) {
                isCalledDuringThrottleRef.current = true;
                lastArgsRef.current = args;
                return;
            }

            throttleWork(...args);
        };
    });

    useUnmountEffect(() => {
        clearTimeout(timeoutRef.current);
    });

    return {
        isThrottling,
        isThrottlingRef,
        throttle,
    };
};