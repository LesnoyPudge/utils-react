import { MutableRefObject, useRef } from 'react';



/**
 * Returns an immutable ref object that stores the latest provided value.
 */
export const useLatest = <_Value>(
    providedValue: _Value,
): Readonly<MutableRefObject<_Value>> => {
    const value = useRef(providedValue);

    value.current = providedValue;

    return value;
};