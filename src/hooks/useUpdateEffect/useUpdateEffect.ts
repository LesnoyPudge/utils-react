import { useFunction } from '@hooks/useFunction';
import { useIsFirstMount } from '@hooks/useIsFirstMount';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useEffect } from 'react';



/**
 * Executes the provided callback when the dependencies change.
 * The callback is not called on initial mount, only on updates.
 */
export const useUpdateEffect = (
    fn: () => void,
    deps: T.UnknownArray,
) => {
    const _fn = useFunction(fn);
    const { getIsFirstMount } = useIsFirstMount();

    useEffect(() => {
        if (getIsFirstMount()) return;

        return _fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_fn, getIsFirstMount, ...deps]);
};