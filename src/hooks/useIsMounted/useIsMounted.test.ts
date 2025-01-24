import { renderHook } from '@testing-library/react';
import { useIsMounted } from './useIsMounted';



describe('useIsMounted', () => {
    it('should track if component is mounted', () => {
        const hook = renderHook(() => useIsMounted());

        const { getIsMounted } = hook.result.current;

        expect(getIsMounted()).toBe(true);

        hook.unmount();

        expect(getIsMounted()).toBe(false);
    });
});