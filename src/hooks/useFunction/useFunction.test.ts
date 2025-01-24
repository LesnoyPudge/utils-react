import { renderHook } from '@testing-library/react';
import { useFunction } from './useFunction';



describe('useFunction', () => {
    it('should return stable reference of provided function', () => {
        const spy = vi.fn();

        const hook = renderHook(() => useFunction(() => {
            spy();
        }));

        const fn = hook.result.current;

        hook.rerender();
        hook.rerender();

        expect(hook.result.current).toBe(fn);

        fn();

        expect(spy).toBeCalledTimes(1);
    });
});