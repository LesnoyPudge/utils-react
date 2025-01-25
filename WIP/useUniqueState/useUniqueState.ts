import { isCallable } from '@lesnoypudge/utils';
import { useFunction } from '_@lesnoypudge/utils-react';
import { Dispatch, SetStateAction, useRef, useState } from 'react';



export namespace useUniqueState {
    export type initialValue<_Value> = _Value | (() => _Value);

    export type setState<_Value> = Dispatch<SetStateAction<_Value>>;

    export type Result<_Value> = [
        state: _Value,
        setState: setState<_Value>,
    ];
}

/**
 * Similar to useState, but skips updates if new state is
 * strictly equal to previous.
 */
export const useUniqueState = <_Value>(
    initialValue: useUniqueState.initialValue<_Value>,
): useUniqueState.Result<_Value> => {
    const [state, setState] = useState(initialValue);
    const ref = useRef(state);

    const setUniqueState: useUniqueState.setState<_Value> = useFunction((
        newValue,
    ) => {
        const newState = (
            isCallable(newValue)
                ? newValue(state)
                : newValue
        );

        if (ref.current === newState) return;

        ref.current = newState;
        setState(newState);
    });

    return [state, setUniqueState];
};