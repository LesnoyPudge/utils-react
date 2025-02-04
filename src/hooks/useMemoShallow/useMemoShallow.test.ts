import { renderHook } from '@testing-library/react';
import { useMemoShallow } from './useMemoShallow';



describe('useMemoShallow', () => {
    it('should not recalculate when values is shallow equal', () => {
        const getValue1 = () => [1];
        const getValue2 = () => [2];

        const initialValue = getValue1();

        const hooks = renderHook(({ value }) => {
            return useMemoShallow(value);
        }, { initialProps: { value: initialValue } });

        hooks.rerender({ value: getValue1() });

        expect(hooks.result.current).toBe(initialValue);

        hooks.rerender({ value: getValue2() });

        expect(hooks.result.current).not.toBe(initialValue);
    });

    it('should recalculate when values is not shallow equal', () => {
        const getValue = () => [{}];

        const initialValue = getValue();

        const hooks = renderHook(({ value }) => {
            return useMemoShallow(value);
        }, { initialProps: { value: initialValue } });

        hooks.rerender({ value: getValue() });

        expect(hooks.result.current).not.toBe(initialValue);
    });
});