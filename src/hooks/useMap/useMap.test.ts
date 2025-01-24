import { act, renderHook } from '@testing-library/react';
import { useMap } from './useMap';
import { useEffect } from 'react';



describe('useMap', () => {
    it('should initialize with default value', () => {
        const hook = renderHook(() => useMap([
            ['key1', 'value1'],
            ['key2', 'value2'],
        ]));

        expect(hook.result.current.get('key1')).toBe('value1');
        expect(hook.result.current.get('key2')).toBe('value2');
    });

    it('should add a new key-value pair', () => {
        const hook = renderHook(() => useMap<string, string>());

        act(() => {
            hook.result.current.set('key1', 'value1');
        });

        expect(hook.result.current.get('key1')).toBe('value1');
    });

    it('should update an existing key-value pair', () => {
        const hook = renderHook(() => useMap<string, string>());

        act(() => {
            hook.result.current.set('key1', 'value1');
            hook.result.current.set('key1', 'updatedValue');
        });

        expect(hook.result.current.get('key1')).toBe('updatedValue');
    });

    it('should delete a key-value pair', () => {
        const hook = renderHook(() => useMap<string, string>());

        act(() => {
            hook.result.current.set('key1', 'value1');
            hook.result.current.delete('key1');
        });

        expect(hook.result.current.get('key1')).toBeUndefined();
    });

    it('should clear all key-value pairs', () => {
        const hook = renderHook(() => useMap<string, string>());

        act(() => {
            hook.result.current.set('key1', 'value1');
            hook.result.current.set('key2', 'value2');
            hook.result.current.clear();
        });

        expect(hook.result.current.size).toBe(0);
    });

    it('should rerender on state change', () => {
        const spy = vi.fn();
        const hook = renderHook(() => {
            useEffect(spy);
            return useMap<string, string>();
        });

        expect(spy).toBeCalledTimes(1);

        act(() => {
            hook.result.current.set('key1', 'value1');
            hook.result.current.set('key2', 'value2');
        });

        expect(spy).toBeCalledTimes(2);


        act(() => {
            hook.result.current.delete('key1');
        });

        expect(spy).toBeCalledTimes(3);


        act(() => {
            hook.result.current.clear();
        });

        expect(spy).toBeCalledTimes(4);
    });
});