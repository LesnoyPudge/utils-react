import { useFunction } from '@hooks/useFunction';
import { usePrevious } from '@hooks/usePrevious';
import { useMemo } from 'react';



/**
 * Returns the memoized value that only updates if the provided value
 * changes according to the custom equality function.
 */
export const useMemoCompare = <_Value>(
    value: _Value,
    getIsEqual: (a: _Value, b: _Value) => boolean,
) => {
    const _getIsEqual = useFunction(getIsEqual);
    const prevValue = usePrevious(value);

    return useMemo(() => {
        if (prevValue === undefined) return value;

        const isEqual = _getIsEqual(value, prevValue);
        if (isEqual) return prevValue;

        return value;
    }, [_getIsEqual, prevValue, value]);
};