import { ContextConsumerProxy } from '@entities/ContextSelectable/components';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import React from 'react';



export const createContextConsumerProxy = <
    _Value extends T.UnknownRecord,
>(
    context: ContextConsumerProxy.Props<_Value>['context'],
) => {
    const ConsumerProxy: React.FC<Pick<
        ContextConsumerProxy.Props<_Value>,
        'children'
    >> = ({ children }) => {
        return (
            <ContextConsumerProxy context={context}>
                {children}
            </ContextConsumerProxy>
        );
    };

    return ConsumerProxy;
};