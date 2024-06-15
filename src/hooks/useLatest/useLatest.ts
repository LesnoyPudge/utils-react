import React from 'react';



export const useLatest = <T>(providedValue: T): React.RefObject<T> => {
    const value = React.useRef(providedValue);

    value.current = providedValue;

    return value;
};