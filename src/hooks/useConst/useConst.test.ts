import { renderHook } from '@testing-library/react';
import { useConst } from './useConst';



describe('useConst', () => {
    it('should return same value and call factory only once', () => {
        const spy = vi.fn(() => ({ value: Math.random() }));

        const hook = renderHook(() => useConst(spy));

        const res = hook.result.current;

        hook.rerender();
        hook.rerender();

        expect(hook.result.current).toBe(res);
        expect(spy).toBeCalledTimes(1);
    });
});