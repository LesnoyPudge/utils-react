import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useConst, useLatest } from '@hooks';



/**
 * Returns stable reference to last version of passed function.
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