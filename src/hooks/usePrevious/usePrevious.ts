import { useEffect, useRef } from 'react';



/**
 * Returns previously provided value;
 */
export const usePrevious = <_Value>(
    value: _Value,
): _Value | undefined => {
    const prevRef = useRef<_Value>();

    useEffect(() => {
        prevRef.current = value;
    });

    // eslint-disable-next-line react-compiler/react-compiler
    return prevRef.current;
};