/* eslint-disable unicorn/consistent-function-scoping */
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

        expect(hooks.result.current).toBe(initialValue);

        hooks.rerender({ value: getValue1() });

        expect(hooks.result.current).toBe(initialValue);

        const value2 = getValue2();
        hooks.rerender({ value: value2 });

        expect(hooks.result.current).toBe(value2);
    });
});