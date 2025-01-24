import { act, renderHook } from '@testing-library/react';
import { useStateWithRef } from './useStateWithRef';



describe('useStateWithRef', () => {
    it('should properly update state', () => {
        const initialState = { v: 0 };
        const hook = renderHook(() => useStateWithRef(initialState));

        const [state, stateRef, setState] = hook.result.current;

        expect(state).toBe(initialState);
        expect(stateRef.current).toBe(initialState);

        const newValue = { v: 1 };

        act(() => setState(newValue));

        expect(hook.result.current[0]).toBe(newValue);
        expect(stateRef.current).toBe(newValue);
    });
});