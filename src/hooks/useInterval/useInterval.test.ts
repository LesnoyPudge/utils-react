import { renderHook } from '@testing-library/react';
import { useInterval } from './useInterval';



describe('useInterval', () => {
    it('should work', () => {
        const spy = vi.fn();
        const DELAY = 1_000;
        const DELAY_HALF = DELAY / 2;

        vi.useFakeTimers();

        const hook = renderHook(() => useInterval(spy, DELAY));

        vi.advanceTimersByTime(DELAY);

        expect(spy).toBeCalledTimes(1);

        vi.advanceTimersByTime(DELAY);

        expect(spy).toBeCalledTimes(2);

        vi.advanceTimersByTime(DELAY_HALF);

        hook.rerender();

        vi.advanceTimersByTime(DELAY_HALF);

        expect(spy).toBeCalledTimes(3);

        hook.unmount();

        vi.advanceTimersByTime(DELAY);

        expect(spy).toBeCalledTimes(3);
    });
});