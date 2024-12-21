import { T } from '@lesnoypudge/types-utils-base/namespace';
import {
    useRef,
    Dispatch,
    SetStateAction,
    MutableRefObject,
    useState,
} from 'react';
import { capitalize, isCallable } from '@lesnoypudge/utils';
import { useFunction } from '@hooks/useFunction';



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
    const [state, _setState] = useState(initialState);
    const stateRef = useRef(state);

    const setState: typeof _setState = useFunction((newValue) => {
        const _state = (
            isCallable(newValue)
                ? newValue(state)
                : newValue
        );

        stateRef.current = _state;
        _setState(_state);
    });

    return {
        [name]: state,
        [`${name}Ref`]: stateRef,
        [`set${capitalize(name)}`]: setState,
        [0]: state,
        [1]: stateRef,
        [2]: setState,
    } as useNamedState.Return<_State, _Name>;
};