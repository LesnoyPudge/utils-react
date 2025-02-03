import { act, renderHook } from '@testing-library/react';
import { createLocalStorageHook } from './createLocalStorageHook';



describe('createLocalStorageHook', () => {
    it('should rerender on value change', () => {
        localStorage.clear();

        const useLocalStorage = createLocalStorageHook<{
            value: number;
        }>();

        const hook = renderHook(() => useLocalStorage('value'));

        expect(hook.result.current.value.value).toBeUndefined();

        act(() => localStorage.setItem('value', '5'));

        expect(hook.result.current.value.value).toBe(5);
    });
});