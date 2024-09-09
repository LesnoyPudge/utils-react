import { shallowEqual } from '@lesnoypudge/utils';
import { useMemoCompare } from '@hooks';



export const useMemoShallow = <_Value>(value: _Value) => {
    return useMemoCompare(value, shallowEqual);
};