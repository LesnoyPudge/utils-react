import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useFunction, useThrottle } from '@hooks';



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