import { useRef } from 'react';
import { useIsFirstMount } from '@hooks/useIsFirstMount';
import { shallowEqual } from '@lesnoypudge/utils';



export const usePrevious = <_Value>(
    value: _Value,
    isEqualFn: typeof shallowEqual = shallowEqual,
) => {
    const prevRef = useRef<_Value>();
    const curRef = useRef<_Value>(value);
    const { isFirstMount } = useIsFirstMount();

    if (!isFirstMount && !isEqualFn(curRef.current, value)) {
        prevRef.current = curRef.current;
        curRef.current = value;
    }

    return prevRef;
};