import { T } from '@lesnoypudge/types-utils-base/namespace';
import { shallowEqual } from '@lesnoypudge/utils';
import { useEffect, useRef } from 'react';



const getDiff = (prev: T.UnknownRecord, next: T.UnknownRecord) => {
    const diff = [
        ...Object.keys(prev),
        ...Object.keys(next),
    ].reduce<T.UnknownRecord>((acc, cur) => {
        if (next[cur] !== prev[cur]) {
            acc[cur] = next[cur];
        }

        return acc;
    }, {});

    return diff;
};

/**
 * Tracks changes in props and logs the differences.
 * Compares the previous and current props using shallow equality.
 */
export const usePropsChange = (props: T.UnknownRecord) => {
    const prevRef = useRef<T.UnknownRecord>();

    useEffect(() => {
        if (prevRef.current === undefined) {
            prevRef.current = props;
            return;
        }

        const diff = getDiff(prevRef.current, props);
        const isEqual = shallowEqual(prevRef.current, props);

        !isEqual && console.log('diff is:', diff);

        prevRef.current = props;
    });
};