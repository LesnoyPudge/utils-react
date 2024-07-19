import { useSyncExternalStore } from 'react';
import { useConst } from '../useConst';
import { Counter, pick } from '@lesnoypudge/utils';
import { T } from '@lesnoypudge/types-utils-base/namespace';



export const useCounter = (
    initialCount?: number,
    initialStep?: number,
) => {
    const counter = useConst(() => new Counter(
        initialCount,
        initialStep,
    ));

    const methods = useConst(() => {
        return pick(
            counter as T.Simplify<Counter>,
            'dec',
            'decrease',
            'get',
            'getCount',
            'getInitialCount',
            'getInitialStep',
            'getStep',
            'inc',
            'increase',
            'reset',
            'resetCount',
            'resetStep',
            'set',
            'setCount',
            'setInitialCount',
            'setStep',
        );
    });

    const count = useSyncExternalStore(
        counter.onCountChange,
        counter.get,
    );

    return {
        count,
        ...methods,
    };
};