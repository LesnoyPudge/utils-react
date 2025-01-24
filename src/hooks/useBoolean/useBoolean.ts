import { useFunction } from '@hooks/useFunction';
import { useStateWithRef } from '@hooks/useStateWithRef';
import { isCallable } from '@lesnoypudge/utils';



/**
 * Manages a boolean state with functionality to modify its value and
 * optionally trigger an external callback when the state changes.
 */
export const useBoolean = (
    initialState: boolean,
    providedOnChange?: (state: boolean) => void,
) => {
    const [state, stateRef, setState] = useStateWithRef(initialState);

    const setStateModified: typeof setState = useFunction((providedState) => {
        const newState = (
            isCallable(providedState)
                ? providedState(stateRef.current)
                : providedState
        );

        setState(newState);
        providedOnChange?.(newState);
    });

    const setTrue = useFunction(() => {
        setStateModified(true);
    });

    const setFalse = useFunction(() => {
        setStateModified(false);
    });

    const toggle = useFunction(() => {
        setStateModified((prev) => !prev);
    });

    return {
        value: state,
        setValue: setStateModified,
        setTrue,
        setFalse,
        toggle,
    };
};