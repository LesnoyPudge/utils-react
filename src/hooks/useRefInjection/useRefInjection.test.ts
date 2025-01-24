import { renderHook } from '@testing-library/react';
import { useRefInjection } from './useRefInjection';



describe('useRefInjection', () => {
    it('should call provided function and change ref', () => {
        const spy = vi.fn();
        const initialState = { v: 1 };
        const hook = renderHook(() => useRefInjection(
            initialState,
            spy,
        ));

        const [stateRef, setState] = hook.result.current;

        expect(stateRef.current).toBe(initialState);

        const newValue = { v: 2 };

        setState(newValue);

        expect(stateRef.current).toBe(newValue);
        expect(spy).toBeCalledTimes(1);
    });
});