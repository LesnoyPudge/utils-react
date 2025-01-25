import { renderHook } from '@testing-library/react';
import { useUpdateEffect } from './useUpdateEffect';



describe('useUpdateEffect', () => {
    it('should trigger callback on dependencies change', () => {
        const spy = vi.fn();
        const hook = renderHook(({ deps }) => useUpdateEffect(spy, deps), {
            initialProps: { deps: [1] },
        });

        expect(spy).toBeCalledTimes(0);

        hook.rerender({ deps: [1] });

        expect(spy).toBeCalledTimes(0);

        hook.rerender({ deps: [2] });

        expect(spy).toBeCalledTimes(1);
    });
});