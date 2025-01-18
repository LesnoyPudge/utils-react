import { MutableRefObject, useInsertionEffect, useRef } from 'react';



export const useLatest = <T>(providedValue: T): MutableRefObject<T> => {
    const value = useRef(providedValue);

    // useInsertionEffect(() => {
    value.current = providedValue;
    // });

    return value;
};