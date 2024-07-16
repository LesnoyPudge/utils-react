import { throttle as throttleLib } from '@lesnoypudge/utils';
import { useCallback } from 'react';
import { useMountedWrapper, useNamedState } from '@hooks';



export const useThrottle = () => {
    const namedState = useNamedState('isThrottling', false);
    const { mounted } = useMountedWrapper();

    /**
     * Passed callback may be called asynchronously.
     * Check that component is mounted before setting state.
     */
    const throttle: typeof throttleLib = useCallback((
        callback,
        delay,
    ) => {
        namedState.setIsThrottling(true);

        return throttleLib((...args: Parameters<typeof callback>) => {
            callback(...args);

            mounted(() => namedState.setIsThrottling(false));
        }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        ...namedState,
        throttle,
    };
};