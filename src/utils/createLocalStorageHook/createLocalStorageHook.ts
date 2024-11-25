import { useConst, useLatest, useNamedState } from '@hooks';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { LocalStorage } from '@lesnoypudge/utils-web';
import { useEffect } from 'react';



export const createLocalStorageHook = <
    _Schema extends Record<string, unknown>,
>() => {
    const _localStorage = new LocalStorage<_Schema>();

    return <
        _Key extends T.StringKeyOf<_Schema>,
        _DefaultValue extends (_Schema[_Key] | undefined),
    >(
        key: _Key,
        defaultValue?: _DefaultValue,
    ): useNamedState.Return<(
        _DefaultValue extends undefined
            ? (_Schema[_Key] | undefined)
            : _Schema[_Key]
    ), _Key> => {
        const _key = useConst(() => key);
        const defaultValueRef = useLatest(defaultValue);
        const state = useNamedState<_Schema[_Key] | undefined>(
            _key,
            _localStorage.get(_key, defaultValue),
        );
        const { '2': setValue } = state;

        useEffect(() => {
            return _localStorage.onChange(_key, (value) => {
                const _value = (
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    value === undefined
                        ? defaultValueRef.current
                        : value
                );

                setValue(_value);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        // @ts-expect-error
        return state;
    };
};