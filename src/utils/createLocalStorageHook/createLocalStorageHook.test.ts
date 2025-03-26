import { act, renderHook } from '@testing-library/react';
import { createLocalStorageHook } from './createLocalStorageHook';



beforeEach(() => localStorage.clear());

describe('createLocalStorageHook', () => {
    it('should rerender on value change', () => {
        const useLocalStorage = createLocalStorageHook<{
            value: number;
        }>();

        const hook = renderHook(() => useLocalStorage('value'));

        expect(hook.result.current.value.value).toBeUndefined();

        act(() => localStorage.setItem('value', '5'));

        expect(hook.result.current.value.value).toBe(5);
    });

    it('should provide default value', () => {
        const useLocalStorage = createLocalStorageHook<{
            value: number;
        }>();

        const hook = renderHook(() => useLocalStorage('value', 5));
        const result = hook.result.current.value.value;

        expect(result).toBe(5);

        expectTypeOf(result).toBeNumber();
    });
});