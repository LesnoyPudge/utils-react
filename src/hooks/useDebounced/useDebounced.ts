import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useDebounce, useFunction } from '@hooks';



/**
 * Callback aren't called when component is unmounted;
 */
export const useDebounced = <
    _CallBack extends T.AnyFunction,
>(
    callback: _CallBack,
    delay: number,
) => {
    const { debounce } = useDebounce({ stateless: true });

    return useFunction(debounce(callback, delay));
};