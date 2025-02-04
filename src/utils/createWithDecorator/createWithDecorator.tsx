import { T } from '@lesnoypudge/types-utils-base/namespace';
import { withDisplayName } from '@utils/withDisplayName';
import { PropsWithChildren, ReactNode } from 'react';



/**
 * Creates a decorator with optional additional properties.
 */
export const createWithDecorator = <
    _ExtraProps extends T.UnknownRecord = T.EmptyObject,
>(
    Decorator: (props: PropsWithChildren & _ExtraProps) => ReactNode,
) => {
    const NamedDecorator = withDisplayName('Decorator', Decorator);

    const withDecorator = <
        _Props extends T.UnknownRecord = T.EmptyObject,
    >(
        Component: (props: _Props) => ReactNode,
    ) => {
        const Decorated = (props: _ExtraProps & _Props) => {
            return (
                <NamedDecorator {...props}>
                    <Component {...props}/>
                </NamedDecorator>
            );
        };

        return Decorated;
    };

    return {
        withDecorator,
    };
};