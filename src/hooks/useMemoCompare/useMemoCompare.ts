import { useFunction } from '@hooks/useFunction';
import { useMemo, useRef } from 'react';



/**
 * Returns the memoized value that only updates if the provided value
 * changes according to the custom equality function.
 */
export const useMemoCompare = <_Value>(
    value: _Value,
    getIsEqual: (a: _Value, b: _Value) => boolean,
) => {
    const prevValueRef = useRef(value);
    const _getIsEqual = useFunction(getIsEqual);

    return useMemo(() => {
        const isEqual = _getIsEqual(prevValueRef.current, value);

        if (!isEqual) {
            prevValueRef.current = value;
        }

        return prevValueRef.current;
    }, [prevValueRef, value, _getIsEqual]);
};