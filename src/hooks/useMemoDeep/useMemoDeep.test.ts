import { renderHook } from '@testing-library/react';
import { useMemoDeep } from './useMemoDeep';



describe('useMemoDeep', () => {
    it('should return the same value if it has not deeply changed', () => {
        const getValue = () => [{ a: 1, b: { c: 2 } }];

        const initialValue = getValue();

        const hook = renderHook(({ value }) => useMemoDeep(value), {
            initialProps: { value: initialValue },
        });

        expect(hook.result.current).toBe(initialValue);

        hook.rerender({ value: getValue() });

        expect(hook.result.current).toBe(initialValue);
    });

    it('should return a new value if it has deeply changed', () => {
        const getInitialValue = () => [{ a: 1, b: { c: 2 } }];
        const getUpdatedValue = () => [{ a: 1, b: { c: 3 } }];

        const initialValue = getInitialValue();

        const hook = renderHook(({ value }) => useMemoDeep(value), {
            initialProps: { value: initialValue },
        });

        hook.rerender({ value: getUpdatedValue() });

        expect(hook.result.current).not.toBe(initialValue);
    });
});