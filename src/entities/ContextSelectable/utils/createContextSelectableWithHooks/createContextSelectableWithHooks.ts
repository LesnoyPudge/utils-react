import { T } from '@lesnoypudge/types-utils-base/namespace';
import {
    createContextSelectable,
    createUseContextProxyHook,
    createUseContextSelectorHook,
} from '@entities/ContextSelectable/utils';



export namespace createContextSelectableWithHooks {
    export type StaticValues<_Value extends T.UnknownRecord> = {
        Context: createContextSelectable.ContextSelectable<_Value>;
        useSelector: createUseContextSelectorHook.Return<_Value>;
        useProxy: createUseContextProxyHook.Return<_Value>;
    };

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
        & StaticValues<_Value>
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

            const Context = createContextSelectable<_Value>(defaultValue);
            const useProxy = createUseContextProxyHook(Context);
            const useSelector = createUseContextSelectorHook(Context);

            const contextName = `${name}Context`;
            const proxyName = `use${name}ContextProxy`;
            const selectorName = `use${name}ContextSelector`;

            const staticValues: (
                createContextSelectableWithHooks.StaticValues<_Value>
            ) = {
                Context,
                useProxy,
                useSelector,
            };

            Object.assign(result, staticValues, {
                [contextName]: Context,
                [proxyName]: useProxy,
                [selectorName]: useSelector,
            });

            return result;
        },
    };
};