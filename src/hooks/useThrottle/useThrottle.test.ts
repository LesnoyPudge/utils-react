import { act, renderHook } from '@testing-library/react';
import { useThrottle } from './useThrottle';



vi.useFakeTimers();

describe('useThrottle', () => {
    it('should throttle function calls', async () => {
        const spy = vi.fn();
        const hook = renderHook(() => useThrottle());
        const DELAY = 1000;

        const throttledFn = hook.result.current.throttle(spy, DELAY);

        act(() => {
            throttledFn();
            throttledFn();
            throttledFn();
        });

        expect(spy).toBeCalledTimes(1);
        expect(hook.result.current.isThrottling).toBe(true);
        expect(hook.result.current.isThrottlingRef.current).toBe(true);

        act(() => {
            vi.advanceTimersByTime(DELAY);
        });

        expect(spy).toBeCalledTimes(2);
        expect(hook.result.current.isThrottling).toBe(true);
        expect(hook.result.current.isThrottlingRef.current).toBe(true);

        act(() => {
            vi.advanceTimersByTime(DELAY);
        });

        expect(spy).toBeCalledTimes(2);
        expect(hook.result.current.isThrottling).toBe(false);
        expect(hook.result.current.isThrottlingRef.current).toBe(false);
    });
});