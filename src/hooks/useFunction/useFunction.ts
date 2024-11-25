import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useConst } from '@hooks/useConst';
import { useLatest } from '@hooks/useLatest';



/**
 * Returns a stable reference to the last version of the passed function.
 */
export const useFunction = <
    _Callback extends T.AnyFunction,
>(callback: _Callback): _Callback => {
    const callbackRef = useLatest(callback);

    return useConst(() => ((...args: Parameters<_Callback>) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return callbackRef.current(...args);
    }) as _Callback);
};