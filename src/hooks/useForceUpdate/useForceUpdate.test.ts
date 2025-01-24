import { act, renderHook } from '@testing-library/react';
import { useForceUpdate } from './useForceUpdate';
import { useEffect } from 'react';



describe('useForceUpdate', () => {
    it('should update when trigger called', () => {
        const spy = vi.fn();

        const hook = renderHook(() => {
            const res = useForceUpdate();

            useEffect(spy);

            return res;
        });

        expect(spy).toBeCalledTimes(1);
        expect(hook.result.current.forcedState).toBe(0);

        const { forceUpdate } = hook.result.current;

        act(forceUpdate);

        expect(spy).toBeCalledTimes(2);
        expect(hook.result.current.forcedState).toBe(1);
    });
});