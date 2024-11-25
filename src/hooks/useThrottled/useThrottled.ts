import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useFunction } from '@hooks/useFunction';
import { useThrottle } from '@hooks/useThrottle';




/**
 * Callback aren't called when component is unmounted;
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