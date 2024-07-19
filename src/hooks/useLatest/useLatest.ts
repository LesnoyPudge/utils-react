import React, { useInsertionEffect } from 'react';



export const useLatest = <T>(providedValue: T): React.MutableRefObject<T> => {
    const value = React.useRef(providedValue);

    useInsertionEffect(() => {
        value.current = providedValue;
    });

    return value;
};