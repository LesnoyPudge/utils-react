import { renderHook } from '@testing-library/react';
import { useMemoCompare } from './useMemoCompare';



describe('useMemoCompare', () => {
    it('should not recalculate when same value is provided', () => {
        const getValue1 = () => [1];
        const getValue2 = () => [2];

        const initialValue = getValue1();

        const hooks = renderHook(({ value }) => {
            return useMemoCompare(value, (a, b) => a[0] === b[0]);
        }, { initialProps: { value: initialValue } });

        hooks.rerender({ value: getValue1() });

        expect(hooks.result.current).toBe(initialValue);

        hooks.rerender({ value: getValue2() });

        expect(hooks.result.current).not.toBe(initialValue);
    });
});