import { MutableRefObject, useRef } from 'react';



/**
 * Returns an immutable ref object that stores the latest provided value.
 */
export const useLatest = <_Value>(
    providedValue: _Value,
): Readonly<MutableRefObject<_Value>> => {
    const ref = useRef(providedValue);

    // eslint-disable-next-line react-compiler/react-compiler
    ref.current = providedValue;

    return ref;
};