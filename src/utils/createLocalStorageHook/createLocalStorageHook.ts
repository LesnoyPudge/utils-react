import { useConst } from '@hooks/useConst';
import { useFunction } from '@hooks/useFunction';
import { useLatest } from '@hooks/useLatest';
import { useStateWithRef } from '@hooks/useStateWithRef';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { isCallable } from '@lesnoypudge/utils';
import { LocalStorage } from '@lesnoypudge/utils-web';
import { Dispatch, SetStateAction, useEffect } from 'react';



export namespace createLocalStorageHook {
    export namespace useLocalStorage {
        export type SetValue<_Value> = Dispatch<SetStateAction<_Value>>;

        export type ReturnObject<_Value> = {
            value: _Value;
            setValue: SetValue<_Value>;
            clear: VoidFunction;
            remove: VoidFunction;
        };

        export type Return<
            _Key extends string,
            _Value,
        > = {
            [x in _Key]: ReturnObject<_Value>
        };
    }
}

export const createLocalStorageHook = <
    _Schema extends Record<string, unknown>,
>() => {
    const _localStorage = new LocalStorage<_Schema>();

    const useLocalStorage = <
        _Key extends T.StringKeyOf<_Schema>,
        _DefaultValue extends _Schema[_Key],
    >(
        key: _Key,
        defaultValue?: _DefaultValue,
    ): createLocalStorageHook.useLocalStorage.Return<
        _Key,
        _Schema[_Key] | _DefaultValue | undefined
    > => {
        const _key = useConst(() => key);
        const defaultValueRef = useLatest(defaultValue);
        const [state, stateRef, setState] = useStateWithRef<
            _Schema[_Key] | _DefaultValue | undefined
        >(defaultValue);

        useEffect(() => {
            return _localStorage.onChange(_key, (newValue) => {
                const value = (
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    newValue === undefined
                        ? defaultValueRef.current
                        : newValue
                );

                setState(value);
            });
        }, [_key, defaultValueRef, setState]);

        const setStorageState: (
            createLocalStorageHook.useLocalStorage.SetValue<typeof state>
        ) = useFunction((newValue) => {
            const value = (
                isCallable(newValue)
                    ? newValue(stateRef.current)
                    : newValue
            ) ?? defaultValueRef.current;

            if (value === undefined) return;

            _localStorage.set(_key, value);
        });

        const clear = useFunction(() => {
            _localStorage.clear();
        });

        const remove = useFunction(() => {
            _localStorage.remove(_key);
        });

        const resultObject: createLocalStorageHook.useLocalStorage.ReturnObject<
            _Schema[_Key] | _DefaultValue | undefined
        > = {
            value: state,
            setValue: setStorageState,
            clear,
            remove,
        };

        return {
            [_key]: resultObject,
        } as createLocalStorageHook.useLocalStorage.Return<
            _Key,
            _Schema[_Key] | _DefaultValue | undefined
        >;
    };

    return useLocalStorage;
};