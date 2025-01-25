import { useRef } from 'react';
import { useIsFirstMount } from '@hooks/useIsFirstMount';
import { shallowEqual } from '@lesnoypudge/utils';



/**
 * Tracks the previous value of the provided value.
 * The comparison function can be customized to determine equality.
 */
export const usePrevious = <_Value>(
    value: _Value,
    isEqualFn: typeof shallowEqual = shallowEqual,
) => {
    const prevRef = useRef<_Value>();
    const curRef = useRef<_Value>(value);
    const { getIsFirstMount } = useIsFirstMount();

    if (!getIsFirstMount() && !isEqualFn(prevRef.current, value)) {
        prevRef.current = curRef.current;
        curRef.current = value;
    }

    return prevRef;
};