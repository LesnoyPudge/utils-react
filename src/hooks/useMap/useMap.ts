import { useFunction } from '@hooks/useFunction';
import { useLatest } from '@hooks/useLatest';
import { useState } from 'react';



/**
 * Returns a mutable map that tracks changes.
 */
export const useMap = <
    _Key,
    _Value,
>(defaultValue?: [_Key, _Value][]) => {
    const [value, setValue] = useState(() => new Map(defaultValue));
    const valueRef = useLatest(value);

    const _set: Map<_Key, _Value>['set'] = useFunction((...args) => {
        const newValue = new Map(valueRef.current);

        Map.prototype.set.apply(newValue, args);
        setValue(newValue);

        return newValue;
    });

    const _delete: Map<_Key, _Value>['delete'] = useFunction((...args) => {
        const newValue = new Map(valueRef.current);

        const res = Map.prototype.delete.apply(newValue, args);
        setValue(newValue);

        return res;
    });

    const _clear: Map<_Key, _Value>['clear'] = useFunction(() => {
        setValue(new Map<_Key, _Value>());
    });

    return {
        clear: _clear,
        delete: _delete,
        entries: value.entries.bind(value),
        forEach: value.forEach.bind(value),
        get: value.get.bind(value),
        has: value.has.bind(value),
        keys: value.keys.bind(value),
        set: _set,
        size: value.size,
        values: value.values.bind(value),
    };
};