import { renderHook } from '@testing-library/react';
import { useDebounced } from './useDebounced';



vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

describe('useDebounced', () => {
    it('should debounce the callback', () => {
        const spy = vi.fn();
        const DELAY = 500;
        const hook = renderHook(() => useDebounced(spy, DELAY));

        hook.result.current();
        hook.result.current();
        hook.result.current();

        expect(spy).toBeCalledTimes(0);

        vi.advanceTimersByTime(DELAY);

        expect(spy).toBeCalledTimes(1);
    });
});