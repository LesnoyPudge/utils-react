import { InlineWorker } from '@lesnoypudge/utils-web';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useUniqueState, useConst, useUnmountEffect } from '@hooks';



/**
 * Only inline functions are allowed, any context
 * inside function will be lost.
 */
export const useInlineWorker = <
    _Args extends unknown[],
    _Return,
>(
    fn: T.AnyFunction<_Args, _Return>,
) => {
    const [value, setValue] = useUniqueState<_Return | undefined>(undefined);
    const worker = useConst(() => new InlineWorker(fn, setValue));

    useUnmountEffect(worker.terminate);

    return {
        value,
        worker,
    };
};