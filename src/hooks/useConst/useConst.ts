import { useRef } from 'react';



const EMPTY_STATE = {};

export const useConst = <_Value>(
    factory: () => _Value,
): _Value => {
    const ref = useRef(EMPTY_STATE as _Value);

    if (ref.current === EMPTY_STATE) {
        ref.current = factory();
    }

    return ref.current;
};