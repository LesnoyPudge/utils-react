import { renderHook } from '@testing-library/react';
import { useDebounced } from './useDebounced';



vi.useFakeTimers();

describe('useDebounced', () => {
    it('should debounce the callback', () => {
        const spy = vi.fn();
        const DELAY = 1_000;
        const hook = renderHook(() => useDebounced(spy, DELAY));

        hook.result.current();
        hook.result.current();
        hook.result.current();

        expect(spy).toBeCalledTimes(0);

        vi.advanceTimersByTime(DELAY);

        expect(spy).toBeCalledTimes(1);
    });
});