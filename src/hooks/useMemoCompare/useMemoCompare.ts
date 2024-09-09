import { useFunction } from '@hooks';
import { useMemo, useRef } from 'react';



export const useMemoCompare = <_Value>(
    value: _Value,
    getIsEqual: (a: unknown, b: unknown) => boolean,
) => {
    const prevValueRef = useRef(value);
    const compare = useFunction(() => {
        const isSame = getIsEqual(prevValueRef.current, value);
        if (!isSame) {
            prevValueRef.current = value;
        }

        return isSame;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => prevValueRef.current, [compare()]);
};