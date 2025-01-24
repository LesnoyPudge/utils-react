import { useRef } from 'react';



const EMPTY_VALUE = {};

/**
 * Initializes and retains a value across renders, calling the factory
 * function only once.
 */
export const useConst = <_Value>(
    factory: () => _Value,
): _Value => {
    const ref = useRef(EMPTY_VALUE as _Value);

    if (ref.current === EMPTY_VALUE) {
        ref.current = factory();
    }

    return ref.current;
};