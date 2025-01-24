import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';



vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

describe('useDebounce', () => {
    it('should track debounce state and trigger callback', async () => {
        const spy = vi.fn();
        const hook = renderHook(() => useDebounce());
        const DELAY = 1000;

        const result = hook.result.current;
        const debouncedFn = result.debounce(spy, DELAY);

        expect(result.isDebouncing).toBe(false);
        expect(result.isDebouncingRef.current).toBe(false);

        act(debouncedFn);

        expect(spy).toBeCalledTimes(0);
        expect(hook.result.current.isDebouncing).toBe(true);
        expect(hook.result.current.isDebouncingRef.current).toBe(true);

        await act(() => vi.advanceTimersByTime(DELAY));

        expect(spy).toBeCalledTimes(1);
        expect(hook.result.current.isDebouncing).toBe(false);
        expect(hook.result.current.isDebouncingRef.current).toBe(false);
    });

    it('should prevent multiple triggers while debouncing', async () => {
        const spy = vi.fn();
        const hook = renderHook(() => useDebounce());
        const DELAY = 1000;
        const SMALL_DELAY = DELAY - (DELAY / 3);
        const BIG_DELAY = DELAY * 2;

        const result = hook.result.current;
        const debouncedFn = result.debounce(spy, DELAY);

        act(debouncedFn);

        await act(() => vi.advanceTimersByTime(SMALL_DELAY));

        act(debouncedFn);
        act(debouncedFn);
        act(debouncedFn);

        expect(spy).toBeCalledTimes(0);
        expect(hook.result.current.isDebouncing).toBe(true);
        expect(hook.result.current.isDebouncingRef.current).toBe(true);

        await act(() => vi.advanceTimersByTime(SMALL_DELAY));

        expect(spy).toBeCalledTimes(0);
        expect(hook.result.current.isDebouncing).toBe(true);
        expect(hook.result.current.isDebouncingRef.current).toBe(true);

        await act(() => vi.advanceTimersByTime(BIG_DELAY));

        expect(spy).toBeCalledTimes(1);
        expect(hook.result.current.isDebouncing).toBe(false);
        expect(hook.result.current.isDebouncingRef.current).toBe(false);
    });
});