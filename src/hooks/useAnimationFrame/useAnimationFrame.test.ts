import { renderHook } from '@testing-library/react';
import { useAnimationFrame } from './useAnimationFrame';



vi.useFakeTimers({ toFake: [
    'requestAnimationFrame',
    'cancelAnimationFrame',
] });

describe('useAnimationFrame', () => {
    it('should autostart with provided flag', () => {
        const spy = vi.fn();
        const hook = renderHook(
            ({ enabled }) => useAnimationFrame(spy, enabled),
            {
                initialProps: { enabled: true },
            },
        );

        expect(spy).toBeCalledTimes(0);

        vi.advanceTimersToNextFrame();

        expect(spy).toBeCalledTimes(1);

        vi.advanceTimersToNextFrame();
        vi.advanceTimersToNextFrame();

        expect(spy).toBeCalledTimes(3);

        hook.rerender({ enabled: false });

        vi.advanceTimersToNextFrame();
        vi.advanceTimersToNextFrame();

        expect(spy).toBeCalledTimes(3);

        hook.rerender({ enabled: true });

        vi.advanceTimersToNextFrame();

        expect(spy).toBeCalledTimes(4);

        hook.unmount();

        vi.advanceTimersToNextFrame();

        expect(spy).toBeCalledTimes(4);
    });

    it('should provide stable controls', () => {
        const spy = vi.fn();
        const hook = renderHook(() => useAnimationFrame(spy, false));

        const original = hook.result.current;

        hook.rerender();

        expect(hook.result.current.start).toBe(original.start);
        expect(hook.result.current.stop).toBe(original.stop);
    });

    it('should provide working controls', () => {
        const spy = vi.fn();
        const hook = renderHook(
            ({ enabled }) => useAnimationFrame(spy, enabled),
            { initialProps: { enabled: false } },
        );

        const { start, stop } = hook.result.current;

        start();

        expect(spy).toBeCalledTimes(0);

        vi.advanceTimersToNextFrame();

        expect(spy).toBeCalledTimes(1);

        stop();

        vi.advanceTimersToNextFrame();
        vi.advanceTimersToNextFrame();

        expect(spy).toBeCalledTimes(1);

        hook.rerender({ enabled: true });

        vi.advanceTimersToNextFrame();

        expect(spy).toBeCalledTimes(2);

        stop();

        vi.advanceTimersToNextFrame();

        expect(spy).toBeCalledTimes(2);
    });
});