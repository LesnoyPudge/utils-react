import {
    createContext as createContextFluent,
} from '@fluentui/react-context-selector';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import React, { FC, Provider, ProviderProps } from 'react';


export type ContextSelectable<_Value> = (
    React.Context<_Value>
    & {
        Provider: React.FC<T.Simplify<
            Pick<React.ProviderProps<_Value>, 'value'>
            // & RT.PropsWithRenderFunctionOrNode<[_Value]>
        >>;
        Consumer: never;
        displayName?: string;
    }
);

export const createContextSelectable = <_Value>(defaultValue?: _Value) => {
    return createContextFluent(
        defaultValue,
    ) as ContextSelectable<_Value>;
};