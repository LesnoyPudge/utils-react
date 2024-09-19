import { ChildrenAsNodeOrFunction } from '@components';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { MutableRefObject, useRef } from 'react';



type ChildrenArgs<T> = [MutableRefObject<T | null>]

type RefArgs<T extends HTMLElement> = PropsWithChildrenAsNodeOrFunction<ChildrenArgs<T>>

export const Ref = <T extends HTMLElement = HTMLElement>({
    children,
}: RefArgs<T>) => {
    const ref = useRef<T | null>(null);
    
    const childrenArgs: ChildrenArgs<T> = [ref];

    return (
        <ChildrenAsNodeOrFunction args={childrenArgs}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};