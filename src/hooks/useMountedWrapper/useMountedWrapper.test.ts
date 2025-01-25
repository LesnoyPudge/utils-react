import { renderHook } from '@testing-library/react';
import { useMountedWrapper } from './useMountedWrapper';



describe('useMountedWrapper', () => {
    it('should trigger callback while mounted', () => {
        const spy = vi.fn();

        const hook = renderHook(() => useMountedWrapper());

        hook.result.current.mounted(spy);

        expect(spy).toBeCalledTimes(1);
    });

    it('should not trigger callback while unmounted', () => {
        const spy = vi.fn();

        const hook = renderHook(() => useMountedWrapper());

        hook.unmount();

        hook.result.current.mounted(spy);

        expect(spy).toBeCalledTimes(0);
    });
});