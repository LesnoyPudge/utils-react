import { T } from '@lesnoypudge/types-utils-base/namespace';
import { debounce } from '@lesnoypudge/utils';
import { useConst, useLatest } from '@hooks';
import { useMemo } from 'react';



/**
 * Passed callback may be called asynchronously.
 * Check that component is mounted before setting state.
 */
export const useDebounced = <
    _CallBack extends T.AnyFunction,
>(
    callback: _CallBack,
    delay: number,
) => {
    const callbackRef = useLatest(callback);
    const _delay = useConst(() => delay);

    return useMemo(() => {
        return debounce((...args: Parameters<_CallBack>) => {
            callbackRef.current(...args);
        }, _delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};