import { act, renderHook } from '@testing-library/react';
import { useSet } from './useSet';
import { useEffect } from 'react';



describe('useSet', () => {
    it('should initialize set with default values', () => {
        const defaultValues = [1, 2, 3];
        const hook = renderHook(() => useSet(defaultValues));

        const result = hook.result.current;
        expect(result.has(1)).toBe(true);
        expect(result.has(2)).toBe(true);
        expect(result.has(3)).toBe(true);
    });

    it('should add value to set', () => {
        const hook = renderHook(() => useSet<number>());

        act(() => {
            hook.result.current.add(1);
        });

        expect(hook.result.current.has(1)).toBe(true);
    });

    it('should delete value from set', () => {
        const hook = renderHook(() => useSet([1, 2, 3]));

        act(() => {
            hook.result.current.delete(2);
        });

        expect(hook.result.current.has(2)).toBe(false);
    });

    it('should clear the set', () => {
        const hook = renderHook(() => useSet([1, 2, 3]));

        act(() => {
            hook.result.current.clear();
        });

        expect(hook.result.current.size).toBe(0);
    });

    it('should trigger re-render when set changes', () => {
        const spy = vi.fn();
        const hook = renderHook(() => {
            useEffect(spy);
            return useSet<number>();
        });

        act(() => {
            hook.result.current.add(4);
        });

        expect(spy).toBeCalledTimes(2);
    });
});