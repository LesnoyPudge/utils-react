import { ContextSelectable } from '@entities/ContextSelectable/ContextSelectable';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { FC } from 'react';



export const createContextConsumerProxy = <
    _Value extends T.UnknownRecord,
>(
    context: ContextSelectable.ConsumerProxy.Props<_Value>['context'],
) => {
    const ConsumerProxy: FC<Pick<
        ContextSelectable.ConsumerProxy.Props<_Value>,
        'children'
    >> = ({ children }) => {
        return (
            <ContextSelectable.ConsumerProxy context={context}>
                {children}
            </ContextSelectable.ConsumerProxy>
        );
    };

    return ConsumerProxy;
};