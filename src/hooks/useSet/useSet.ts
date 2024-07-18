import { useFunction } from '@hooks';
import { useState } from 'react';



export const useSet = <_Value>(defaultValue?: _Value[]) => {
    const [value, setValue] = useState(() => new Set(defaultValue));

    const _add: Set<_Value>['add'] = useFunction((...args) => {
        const newValue = new Set(value);

        Set.prototype.add.apply(newValue, args);
        setValue(newValue);

        return newValue;
    });

    const _delete: Set<_Value>['delete'] = useFunction((...args) => {
        const newValue = new Set(value);

        const res = Set.prototype.delete.apply(newValue, args);
        setValue(newValue);

        return res;
    });

    const _clear: Set<_Value>['clear'] = useFunction(() => {
        setValue(new Set());
    });

    value.add = _add;
    value.delete = _delete;
    value.clear = _clear;

    return value;
};