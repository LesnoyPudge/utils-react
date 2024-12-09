import { T } from '@lesnoypudge/types-utils-base/namespace';
import { shallowEqual } from '@lesnoypudge/utils';
import { useEffect, useRef } from 'react';



export const useUpdateEffect = (
    fn: () => void,
    deps: T.UnknownArray,
) => {
    const prevDepsRef = useRef<typeof deps>(deps);

    useEffect(() => {
        if (shallowEqual(deps, prevDepsRef.current)) return;

        prevDepsRef.current = deps;

        return fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};