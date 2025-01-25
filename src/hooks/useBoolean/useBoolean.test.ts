import { act, renderHook } from '@testing-library/react';
import { useBoolean } from './useBoolean';



describe('useBoolean', () => {
    it('should provide working controls', () => {
        const initialValue = false;
        const hook = renderHook(() => useBoolean(initialValue));

        const { value, ...controls } = hook.result.current;

        expect(value).toBe(initialValue);

        act(() => controls.setTrue());

        expect(hook.result.current.value).toBe(true);

        act(() => controls.setFalse());

        expect(hook.result.current.value).toBe(false);

        act(() => controls.toggle());

        expect(hook.result.current.value).toBe(true);
    });

    it('should call onChange callback', () => {
        const spy = vi.fn();
        const hook = renderHook(() => useBoolean(false, spy));

        act(() => hook.result.current.setTrue());

        expect(spy).toBeCalledTimes(1);
        expect(spy).lastCalledWith(true);
    });
});