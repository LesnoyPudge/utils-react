import { useFunction } from '@hooks/useFunction';
import { useMemoDeep } from '@hooks/useMemoDeep';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useEffect } from 'react';



export const useUpdateEffect = (
    fn: () => void,
    deps: T.UnknownArray,
) => {
    const memoizedDeps = useMemoDeep(deps);
    const _fn = useFunction(fn);

    useEffect(() => {
        return _fn();
    }, [_fn, memoizedDeps]);
};