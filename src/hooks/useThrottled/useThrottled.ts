import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useFunction } from '@hooks/useFunction';
import { useThrottle } from '@hooks/useThrottle';



/**
 * Returns a throttled version of the provided callback function.
 */
export const useThrottled = <
    _CallBack extends T.AnyFunction,
>(
    callback: _CallBack,
    delay: number,
) => {
    const { throttle } = useThrottle({ stateless: true });

    return useFunction(throttle(callback, delay));
};