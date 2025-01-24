import { shallowEqual } from '@lesnoypudge/utils';
import { useMemoCompare } from '@hooks/useMemoCompare';



/**
 * Returns the previous value if the value hasn't changed based on
 * a shallow equality check.
 */
export const useMemoShallow = <_Value>(value: _Value) => {
    return useMemoCompare(value, shallowEqual);
};