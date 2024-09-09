import { deepEqual } from '@lesnoypudge/utils';
import { useMemoCompare } from '@hooks';



export const useMemoDeep = <_Value>(value: _Value) => {
    return useMemoCompare(value, deepEqual);
};