import { catchErrorAsync, sleep } from '@lesnoypudge/utils';
import { Types } from '../types';



const defaultBackoffFn = (count: number) => {
    return count * 2_000;
};

export const asyncRetry = async <_Result>(
    fn: Types.PromiseFactory<_Result>,
    options?: Types.asyncRetry.Options,
) => {
    const {
        backoffFn = defaultBackoffFn,
        maxTriesCount = 5,
    } = options ?? {};

    let result: _Result | undefined;

    for (let count = 0; count < maxTriesCount; count++) {
        await sleep(backoffFn(count));

        const [res] = await catchErrorAsync(fn);
        if (res) {
            result = res;
            count = maxTriesCount;
        }
    }

    return result;
};