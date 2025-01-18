import { ContextConsumerProxy } from '@entities/ContextSelectable/components';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { FC } from 'react';



export const createContextConsumerProxy = <
    _Value extends T.UnknownRecord,
>(
    context: ContextConsumerProxy.Props<_Value>['context'],
) => {
    const ConsumerProxy: FC<Pick<
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