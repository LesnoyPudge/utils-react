import { useState, useSyncExternalStore } from 'react';
import { useConst } from '../useConst';
import { Counter } from '@lesnoypudge/utils';



export const useCounter = (
    initialCount?: number,
    initialStep?: number,
) => {
    const counter = useConst(() => new Counter(
        initialCount,
        initialStep,
    ));

    const methods = useConst(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { onCountChange, ...methods } = counter;
        return methods;
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