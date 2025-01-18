import { useFunction } from '@hooks/useFunction';
import { useMemo, useRef } from 'react';



export const useMemoCompare = <_Value>(
    value: _Value,
    getIsEqual: (a: unknown, b: unknown) => boolean,
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