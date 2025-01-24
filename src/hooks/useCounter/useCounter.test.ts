import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';



describe('useCounter', () => {
    it('should initialize with default values', () => {
        const hook = renderHook(() => useCounter());

        expect(hook.result.current.count).toBe(0);
    });

    it('should initialize with custom values', () => {
        const hook = renderHook(() => useCounter(10));

        expect(hook.result.current.count).toBe(10);
    });

    it('should increment count', () => {
        const hook = renderHook(() => useCounter(10));

        act(() => {
            hook.result.current.inc();
        });

        expect(hook.result.current.count).toBe(11);
    });

    it('should decrement count', () => {
        const hook = renderHook(() => useCounter(10));

        act(() => {
            hook.result.current.dec();
        });

        expect(hook.result.current.count).toBe(9);
    });

    it('should reset count', () => {
        const hook = renderHook(() => useCounter(10));

        act(() => {
            hook.result.current.reset();
        });

        expect(hook.result.current.count).toBe(10);
    });

    it('should set count', () => {
        const hook = renderHook(() => useCounter(10));

        act(() => {
            hook.result.current.set(20);
        });

        expect(hook.result.current.count).toBe(20);
    });

    it('should increment count by step value', () => {
        const hook = renderHook(() => useCounter(10, 2));

        act(() => {
            hook.result.current.inc();
        });

        expect(hook.result.current.count).toBe(12);
    });

    it('should decrement count by step value', () => {
        const hook = renderHook(() => useCounter(10, 2));

        act(() => {
            hook.result.current.dec();
        });

        expect(hook.result.current.count).toBe(8);
    });
});