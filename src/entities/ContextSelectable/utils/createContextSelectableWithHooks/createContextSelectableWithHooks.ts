import { T } from '@lesnoypudge/types-utils-base/namespace';
import {
    createContextSelectable,
    createUseContextProxyHook,
    createUseContextSelectorHook,
} from '@entities/ContextSelectable/utils';



export namespace createContextSelectableWithHooks {
    export type Values<
        _Value extends T.UnknownRecord,
        _Name extends string,
    > = T.Simplify<(
        {
            [x in `${_Name}Context`]: (
                createContextSelectable.ContextSelectable<_Value>
            );
        }
        & {
            [y in `use${_Name}ContextProxy`]: (
                createUseContextProxyHook.Return<_Value>
            );
        }
        & {
            [y in `use${_Name}ContextSelector`]: (
                createUseContextSelectorHook.Return<_Value>
            );
        }
    )>;

    export type Return<
        _Value extends T.UnknownRecord,
    > = {
        withName: <
            _Name extends string,
        >(name: _Name) => Values<_Value, _Name>;
    };
}

export const createContextSelectableWithHooks = <
    _Value extends T.UnknownRecord,
>(
    defaultValue?: _Value,
): createContextSelectableWithHooks.Return<_Value> => {
    return {
        withName: (name) => {
            const result = {} as (
                createContextSelectableWithHooks.Values<_Value, typeof name>
            );

            const context = createContextSelectable<_Value>(defaultValue);
            const proxyHook = createUseContextProxyHook(context);
            const selectorHook = createUseContextSelectorHook(context);

            const contextName = `${name}Context`;
            const proxyName = `use${name}ContextProxy`;
            const selectorName = `use${name}ContextSelector`;

            Object.assign(result, {
                [contextName]: context,
                [proxyName]: proxyHook,
                [selectorName]: selectorHook,
            });

            return result;
        },
    };
};