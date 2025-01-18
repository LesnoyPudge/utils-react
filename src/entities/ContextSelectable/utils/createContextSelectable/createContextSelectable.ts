import {
    createContext as createContextFluent,
} from '@fluentui/react-context-selector';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { Context, FC, ProviderProps } from 'react';



export type ContextSelectable<
    _Value extends T.UnknownRecord,
> = (
    Context<_Value>
    & {
        Provider: FC<T.Simplify<Pick<
            ProviderProps<_Value>,
            'value'
        >>>;
        Consumer: never;
        selectable: true;
    }
);

export const createContextSelectable = <
    _Value extends T.UnknownRecord,
>(
    defaultValue?: _Value,
) => {
    return createContextFluent(
        defaultValue,
    ) as ContextSelectable<_Value>;
};