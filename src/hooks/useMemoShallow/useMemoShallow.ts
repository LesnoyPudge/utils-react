import { shallowEqual } from '@lesnoypudge/utils';
import { useMemoCompare } from '@hooks/useMemoCompare';



export const useMemoShallow = <_Value>(value: _Value) => {
    return useMemoCompare(value, shallowEqual);
};