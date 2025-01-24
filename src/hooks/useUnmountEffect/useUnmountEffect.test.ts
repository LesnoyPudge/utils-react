import { renderHook } from '@testing-library/react';
import { useUnmountEffect } from './useUnmountEffect';



describe('useUnmountEffect', () => {
    it('should execute callback only on unmount', () => {
        const spy = vi.fn();
        const hook = renderHook(() => useUnmountEffect(spy));

        hook.rerender();
        hook.rerender();
        hook.unmount();

        expect(spy).toBeCalledTimes(1);
    });
});