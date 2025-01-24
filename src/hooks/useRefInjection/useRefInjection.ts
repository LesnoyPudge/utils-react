import { useFunction } from '@hooks/useFunction';
import { isCallable } from '@lesnoypudge/utils';
import { Dispatch, MutableRefObject, SetStateAction, useRef } from 'react';



export namespace useRefInjection {
    export type Fn<_State> = Dispatch<SetStateAction<_State>>;

    export type Ref<_State> = Readonly<MutableRefObject<_State>>;

    export type Return<_State> = [
        stateRef: Ref<_State>,
        setState: Fn<_State>,
    ];
}

/**
 * Provides a reference to a state and a setter function, with support for
 * state injection via an external setter function.
 */
export const useRefInjection = <_State>(
    initialState: _State,
    setStateForInjection: useRefInjection.Fn<_State>,
): useRefInjection.Return<_State> => {
    const stateRef = useRef(initialState);

    const setStateWithInjection: (
        useRefInjection.Fn<_State>
    ) = useFunction((newState) => {
        const value = (
            isCallable(newState)
                ? newState(stateRef.current)
                : newState
        );

        setStateForInjection(value);
        stateRef.current = value;
    });

    return [stateRef, setStateWithInjection];
};