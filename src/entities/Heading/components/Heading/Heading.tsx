import { createElement, FC, HTMLProps, useContext } from 'react';
import { HeadingContext } from '../HeadingContext';



export const Heading: FC<HTMLProps<HTMLHeadingElement>> = ({
    children,
    ...rest
}) => {
    const level = useContext(HeadingContext);

    if (level === 0) {
        console.error('Heading component is not wrapped in HeadingProvider');
    }

    const Tag = `h${String(level)}`;

    return createElement(Tag, rest, children);
};