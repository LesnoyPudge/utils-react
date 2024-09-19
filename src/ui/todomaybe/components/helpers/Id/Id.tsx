import { FC, useId } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';
import { PropsWithChildrenAsNodeOrFunction } from '@types';



type ChildrenArgs = [id: string]

export const Id: FC<PropsWithChildrenAsNodeOrFunction<ChildrenArgs>> = ({ children }) => {
    const id = useId();

    const childrenArgs: ChildrenArgs = [id];

    return (
        <ChildrenAsNodeOrFunction args={childrenArgs}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};