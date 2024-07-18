import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useEffect } from 'react';
import { useFunction, useIsFirstRender } from '@hooks';



export const useUpdateEffect = (
    fn: () => (undefined | (() => void)),
    deps?: T.UnknownArray,
) => {
    const _fn = useFunction(fn);
    const { getIsFirstRender } = useIsFirstRender();

    useEffect(() => {
        if (getIsFirstRender()) return;

        return _fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};