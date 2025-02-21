import { renderHook } from '@testing-library/react';
import { useRefManager } from './useRefManager';
import { useEffect } from 'react';



describe('useRefManager', () => {
    it('should return stable object', () => {
        const value = {};
        const hook = renderHook(() => useRefManager(value));

        const initialResult = hook.result.current;

        hook.rerender();
        hook.rerender();
        hook.rerender();

        expect(hook.result.current).toBe(initialResult);
        expect(hook.result.current.current).toBe(value);
    });

    it('effect should work', () => {
        const spyEffectOn = vi.fn();
        const spyEffectOff = vi.fn();

        const hook = renderHook(({ value }) => {
            const ref = useRefManager<number>(null);

            ref.current = value;

            useEffect(() => {
                return ref.effect((refValue) => {
                    spyEffectOn(refValue);

                    return spyEffectOff;
                });
            }, [ref]);

            return ref;
        }, { initialProps: { value: null } as { value: number | null } });

        expect(spyEffectOn).toBeCalledTimes(1);
        expect(spyEffectOn).lastCalledWith(null);
        expect(spyEffectOff).toBeCalledTimes(0);

        hook.rerender({ value: 1 });

        expect(spyEffectOn).toBeCalledTimes(2);
        expect(spyEffectOn).lastCalledWith(1);
        expect(spyEffectOff).toBeCalledTimes(1);

        hook.unmount();

        expect(spyEffectOn).toBeCalledTimes(2);
        expect(spyEffectOn).lastCalledWith(1);
        expect(spyEffectOff).toBeCalledTimes(2);
    });
});