import { ComponentProps, FC } from 'react';



export namespace AccessiblyHidden {
    export type Props = ComponentProps<'div'>;
};

export const AccessiblyHidden: FC<AccessiblyHidden.Props> = ({
    children,
    ...rest
}) => {
    return (
        <div
            aria-hidden
            {...rest}
        >
            {children}
        </div>
    );
};