import {
    createContext as createContextFluent,
} from '@fluentui/react-context-selector';
import { T } from '@lesnoypudge/types-utils-base';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
// import type * as Fluent from '@fluentui/react-context-selector';
import React from 'react';


export type ContextSelectable<_Value> = (
    React.Context<_Value>
    // React.Context<Fluent.ContextValue<_Value>>
    & {
        Provider: React.FC<
            T.StrictOmit<React.ProviderProps<_Value>, 'children'>
            & RT.PropsWithRenderFunctionOrNode<[_Value]>
        >;
        // Provider: React.FC<React.ProviderProps<Fluent.ContextValue<_Value>>>;
        Consumer: never;
        displayName?: string;
    }
);

export const createContextSelectable = <_Value>(defaultValue?: _Value) => {
    return createContextFluent(
        defaultValue,
    ) as ContextSelectable<_Value>;
};