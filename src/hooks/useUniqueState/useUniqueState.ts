import { useFunction } from '@hooks';
import { isCallable } from '@lesnoypudge/utils';
import { useState } from 'react';



/**
 * Similar to useState, but skips updates if
 * the same value is passed to the setter.
 */
export const useUniqueState = <_Value>(
    initial: _Value | (() => _Value),
) => {
    const [state, setState] = useState(initial);

    const setUniqueState: typeof setState = useFunction((newValue) => {
        const newState = (
            isCallable(newValue)
                ? newValue(state)
                : newValue
        );

        if (state === newState) return;

        setState(newState);
    });

    return [
        state,
        setUniqueState,
    ] as [typeof state, typeof setUniqueState];
};