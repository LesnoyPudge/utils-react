import {
    ContextSelectable, ContextSelectableConsumer,
    withDisplayName,
} from '@root';

type CreatedContextSelectableConsumerProps<
    _Value,
    _SelectedValue,
> = Pick<
    Parameters<typeof ContextSelectableConsumer<
        _Value,
        _SelectedValue
    >>[0],
    'children' | 'selector'
>;

export const createContextSelectableConsumer = <_Value,>(
    context: ContextSelectable<_Value>,
    displayName: string,
) => {
    const Consumer = <
        _SelectedValue = _Value,
    >({
        children,
        selector,
    }: CreatedContextSelectableConsumerProps<_Value, _SelectedValue>) => {
        return (
            <ContextSelectableConsumer
                context={context}
                selector={selector}
            >
                {children}
            </ContextSelectableConsumer>
        );
    };

    return withDisplayName(
        `${displayName}ContextSelectableConsumer`,
        Consumer,
    );
};