import { deepEqual } from '@lesnoypudge/utils';
import { useMemoCompare } from '@hooks/useMemoCompare';



export const useMemoDeep = <_Value>(value: _Value) => {
    return useMemoCompare(value, deepEqual);
};