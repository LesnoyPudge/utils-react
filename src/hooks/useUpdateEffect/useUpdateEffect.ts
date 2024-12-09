import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useEffect } from 'react';
import { useIsFirstRender } from '@hooks/useIsFirstRender';



export const useUpdateEffect = (
    fn: () => void,
    deps?: T.UnknownArray,
) => {
    const { getIsFirstRender } = useIsFirstRender();

    useEffect(() => {
        if (getIsFirstRender()) return;

        return fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};