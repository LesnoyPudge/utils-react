import { useFunction } from '@hooks';
import { isCallable } from '@lesnoypudge/utils';
import { Dispatch, SetStateAction, useState } from 'react';



export namespace useUniqueState {
    export type initialValue<_Value> = _Value | (() => _Value);

    export type setState<_Value> = Dispatch<SetStateAction<_Value>>;

    export type Result<_Value> = [state: _Value, setState: setState<_Value>];
}

const defaultCompare = (prev: unknown, next: unknown) => prev === next;

/**
 * Similar to useState, but skips updates if
 * compare function returns true.
 * Strict equality is used by default.
 */
export const useUniqueState = <_Value>(
    initialValue: useUniqueState.initialValue<_Value>,
    compare: (prev: _Value, next: _Value) => boolean = defaultCompare,
): useUniqueState.Result<_Value> => {
    const [state, setState] = useState(initialValue);

    const setUniqueState: (
        useUniqueState.setState<_Value>
    ) = useFunction((newValue) => {
        const newState = (
            isCallable(newValue)
                ? newValue(state)
                : newValue
        );

        if (compare(state, newState)) return;

        setState(newState);
    });

    return [
        state,
        setUniqueState,
    ];
};