import { renderHook } from '@testing-library/react';
import { useIsFirstMount } from './useIsFirstMount';



describe('useIsFirstMount', () => {
    it('should return true only on the first mount', () => {
        const hook = renderHook(() => useIsFirstMount());

        expect(hook.result.current.getIsFirstMount()).toBe(true);

        hook.rerender();

        expect(hook.result.current.getIsFirstMount()).toBe(false);
    });
});