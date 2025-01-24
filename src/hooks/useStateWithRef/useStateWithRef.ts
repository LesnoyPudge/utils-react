import { useRefInjection } from '@hooks/useRefInjection';
import { useState } from 'react';



export namespace useStateWithRef {
    export type Return<_State> = [
        state: _State,
        stateRef: useRefInjection.Ref<_State>,
        setState: useRefInjection.Fn<_State>,
    ];
}

/**
 * Provides a state with a reference to its value and a setter function,
 * while also supporting state injection via an external setter function.
 */
export const useStateWithRef = <_State>(
    initialState: _State | (() => _State),
): useStateWithRef.Return<_State> => {
    const [state, setStateOriginal] = useState(initialState);
    const [
        stateRef,
        setState,
    ] = useRefInjection(state, setStateOriginal);

    return [
        state,
        stateRef,
        setState,
    ];
};