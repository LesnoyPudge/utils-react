import { renderHook } from '@testing-library/react';
import { useTimeout } from './useTimeout';



vi.useFakeTimers();

describe('useTimeout', () => {
    it('should call callback after specified delay', () => {
        const spy = vi.fn();
        const DELAY = 1_000;
        renderHook(() => useTimeout(spy, DELAY));

        expect(spy).toBeCalledTimes(0);

        vi.advanceTimersByTime(DELAY);

        expect(spy).toBeCalledTimes(1);
    });

    it('should clear timeout on unmount', () => {
        const spy = vi.fn();
        const DELAY = 1_000;
        const hook = renderHook(() => useTimeout(spy, DELAY));

        hook.unmount();

        vi.advanceTimersByTime(DELAY);

        expect(spy).toBeCalledTimes(0);
    });

    it('should reset timeout when delay changes', () => {
        const spy = vi.fn();
        const DELAY_1 = 1_000;
        const DELAY_2 = 500;
        const hook = renderHook(({ delay }) => useTimeout(spy, delay), {
            initialProps: { delay: DELAY_1 },
        });

        expect(spy).toBeCalledTimes(0);

        hook.rerender({ delay: DELAY_2 });

        vi.advanceTimersByTime(DELAY_2);

        expect(spy).toBeCalledTimes(1);
    });
});