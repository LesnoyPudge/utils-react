import { debounce as debounceLib } from '@lesnoypudge/utils';
import { useCallback } from 'react';
import { useMountedWrapper, useNamedState } from '@hooks';



export const useDebounce = () => {
    const namedState = useNamedState('isDebouncing', false);
    const { mounted } = useMountedWrapper();

    /**
     * Passed callback may be called asynchronously.
     * Check that component is mounted before setting state.
     */
    const debounce: typeof debounceLib = useCallback((
        callback,
        delay,
    ) => {
        namedState.setIsDebouncing(true);

        return debounceLib((...args: Parameters<typeof callback>) => {
            callback(...args);
            mounted(() => namedState.setIsDebouncing(false));
        }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        ...namedState,
        debounce,
    };
};