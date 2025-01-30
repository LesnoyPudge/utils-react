import { renderHook } from '@testing-library/react';
import { useThrottled } from './useThrottled';



vi.useFakeTimers();

describe('useThrottled', () => {
    it('should throttle the callback', () => {
        const spy = vi.fn();
        const DELAY = 1_000;
        const hook = renderHook(() => useThrottled(spy, DELAY));

        hook.result.current();
        hook.result.current();
        hook.result.current();

        expect(spy).toBeCalledTimes(1);

        vi.advanceTimersByTime(DELAY);

        expect(spy).toBeCalledTimes(2);

        vi.advanceTimersByTime(DELAY);

        expect(spy).toBeCalledTimes(2);
    });
});