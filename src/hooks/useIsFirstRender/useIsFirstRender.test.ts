import { renderHook } from '@testing-library/react';
import { useIsFirstRender } from './useIsFirstRender';



describe('useIsFirstRender', () => {
    it('should return true only on the first render', () => {
        const hook = renderHook(() => useIsFirstRender());

        expect(hook.result.current.isFirstRender).toBe(true);

        hook.rerender();

        expect(hook.result.current.isFirstRender).toBe(false);
    });
});