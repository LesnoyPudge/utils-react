import { useFunction } from '@hooks/useFunction';
import { useLatest } from '@hooks/useLatest';
import { useState } from 'react';



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

    value.set = _set;
    value.delete = _delete;
    value.clear = _clear;

    return value;
};