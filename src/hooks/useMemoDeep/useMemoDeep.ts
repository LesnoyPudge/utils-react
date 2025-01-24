import { deepEqual } from '@lesnoypudge/utils';
import { useMemoCompare } from '@hooks/useMemoCompare';



/**
 * Returns the previous value if the value hasn't changed based on
 * a deep equality check.
 */
export const useMemoDeep = <_Value>(value: _Value) => {
    return useMemoCompare(value, deepEqual);
};