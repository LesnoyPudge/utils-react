import { renderHook } from '@testing-library/react';
import { useMountEffect } from './useMountEffect';



describe('useMountEffect', () => {
    it('should execute the provided function only on mount', () => {
        const spy = vi.fn();

        const hook = renderHook(() => useMountEffect(spy));

        expect(spy).toBeCalledTimes(1);

        hook.rerender();
        hook.unmount();

        expect(spy).toBeCalledTimes(1);
    });
});