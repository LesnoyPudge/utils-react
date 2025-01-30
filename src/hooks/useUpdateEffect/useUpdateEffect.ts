import { useFunction } from '@hooks/useFunction';
import { useIsFirstMount } from '@hooks/useIsFirstMount';
import { usePrevious } from '@hooks/usePrevious';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { shallowEqual } from '@lesnoypudge/utils';
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
    const { isFirstMount } = useIsFirstMount();
    const prevDeps = usePrevious(deps);

    useEffect(() => {
        if (isFirstMount) return;
        if (shallowEqual(deps, prevDeps)) return;

        return _fn();
    }, [_fn, isFirstMount, deps, prevDeps]);
};