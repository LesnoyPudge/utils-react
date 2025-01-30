import { useFunction } from '@hooks/useFunction';
import { useState } from 'react';



/**
 * Provides a set with functionality to manage its values, including
 * adding, removing, and clearing items. The set is reactive, so updates
 * to the set's state trigger re-renders.
 */
export const useSet = <_Value>(
    defaultValue?: _Value[],
) => {
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

    return {
        size: value.size,
        add: _add,
        clear: _clear,
        delete: _delete,
        entries: value.entries.bind(value),
        forEach: value.forEach.bind(value),
        has: value.has.bind(value),
        keys: value.keys.bind(value),
        values: value.values.bind(value),
    };
};