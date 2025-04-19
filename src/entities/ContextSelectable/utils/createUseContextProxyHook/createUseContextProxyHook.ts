import { T } from '@lesnoypudge/types-utils-base/namespace';
import { createContextSelectable } from '@entities/ContextSelectable/utils';
import { useContextProxy } from '@entities/ContextSelectable/hooks';



export namespace createUseContextProxyHook {
    export type Return<
        _Value extends T.UnknownRecord,
    > = () => _Value;
}

export const createUseContextProxyHook = <
    _Value extends T.UnknownRecord,
>(
    context: createContextSelectable.ContextSelectable<_Value>,
): createUseContextProxyHook.Return<_Value> => {
    return () => {
        return useContextProxy(context);
    };
};