import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useDebounce } from '@hooks/useDebounce';
import { useFunction } from '@hooks/useFunction';
import { useConst } from '@hooks/useConst';



/**
 * Returns a debounced version of the provided callback function.
 */
export const useDebounced = <
    _CallBack extends T.AnyFunction,
>(
    callback: _CallBack,
    delay: number,
) => {
    const { debounce } = useDebounce({ stateless: true });
    const _callback = useFunction(callback);

    return useConst(() => debounce(_callback, delay));
};