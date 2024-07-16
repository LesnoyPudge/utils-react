import { T } from '@lesnoypudge/types-utils-base/namespace';
import {
    useCallback,
    useRef,
    useState,
    Dispatch,
    SetStateAction,
    MutableRefObject,
} from 'react';
import { capitalize, isCallable } from '@lesnoypudge/utils';



export namespace useNamedState {
    export type Return<
        _State,
        _Name extends string,
    > = (
        T.Simplify<{
            [state in _Name]: _State;
        } & {
            [stateRef in `${_Name}Ref`]: MutableRefObject<_State>;
        } & {
            [setState in `set${Capitalize<_Name>}`]: (
                Dispatch<SetStateAction<_State>>
            );
        } & {
            [0]: _State;
            [1]: MutableRefObject<_State>;
            [2]: Dispatch<SetStateAction<_State>>;
        }>
    );
}

export const useNamedState = <
    _State,
    _Name extends string = string,
>(
    name: _Name,
    initialState: _State | (() => _State),
): useNamedState.Return<_State, _Name> => {
    const [value, setValue] = useState(initialState);
    const stateRef = useRef(value);

    const setUniqueValue: typeof setValue = useCallback((newValue) => {
        const state = (
            isCallable(newValue)
                ? newValue(stateRef.current)
                : newValue
        );

        if (stateRef.current === state) return;

        stateRef.current = state;
        setValue(state);
    }, []);

    const result = {
        [name]: value,
        [`${name}Ref`]: stateRef,
        [`set${capitalize(name)}`]: setUniqueValue,
        [0]: value,
        [1]: stateRef,
        [2]: setUniqueValue,
    } as useNamedState.Return<_State, _Name>;

    return result;
};