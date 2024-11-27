import { FC, HTMLProps, useContext } from 'react';
import { HeadingContext } from '../HeadingContext';



export const Heading: FC<HTMLProps<HTMLHeadingElement>> = ({
    children,
    ...rest
}) => {
    const level = useContext(HeadingContext) as number | undefined;

    const Tag = `h${level ?? 1}`;

    return (
        <Tag {...rest}>
            {children}
        </Tag>
    );
};