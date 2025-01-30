import { useSyncExternalStore } from 'react';
import { useConst } from '@hooks/useConst';
import { Counter, pick } from '@lesnoypudge/utils';
import { T } from '@lesnoypudge/types-utils-base/namespace';



export namespace useCounter {
    export type Methods = Pick<
        Counter,
        'dec'
        | 'decrease'
        | 'get'
        | 'getCount'
        | 'getInitialCount'
        | 'getInitialStep'
        | 'getStep'
        | 'inc'
        | 'increase'
        | 'reset'
        | 'resetCount'
        | 'resetStep'
        | 'set'
        | 'setCount'
        | 'setInitialCount'
        | 'setStep'
    >;

    export type Return = (
        Methods
        & {
            count: number;
        }
    );
}

/**
 * Provides a counter with methods to manipulate and track its value.
 */
export const useCounter = (
    initialCount?: number,
    initialStep?: number,
): useCounter.Return => {
    const counter = useConst(() => new Counter(
        initialCount,
        initialStep,
    ));

    const methods: useCounter.Methods = useConst(() => {
        return pick(
            counter,
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
        ...methods,
        count,
    };
};