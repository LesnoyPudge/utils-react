import { throttle } from '@lesnoypudge/utils';
import { useMemo } from 'react';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useConst, useLatest } from '@hooks';


/**
 * Passed callback may be called asynchronously.
 * Check that component is mounted before setting state.
 */
export const useThrottled = <
    _CallBack extends T.AnyFunction,
>(
    callback: _CallBack,
    delay: number,
) => {
    const callbackRef = useLatest(callback);
    const _delay = useConst(() => delay);

    return useMemo(() => {
        return throttle((...args: Parameters<_CallBack>) => {
            callbackRef.current(...args);
        }, _delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};