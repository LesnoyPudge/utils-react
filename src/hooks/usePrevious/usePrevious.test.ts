import { renderHook } from '@testing-library/react';
import { usePrevious } from './usePrevious';



describe('usePrevious', () => {
    it('should provide previous value', () => {
        const hook = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: 1 },
        });

        expect(hook.result.current.current).toBeUndefined();

        hook.rerender({ value: 2 });

        expect(hook.result.current.current).toBe(1);

        hook.rerender({ value: 2 });

        expect(hook.result.current.current).toBe(2);
    });
});