import { ChildrenAsNodeOrFunction } from '@components';
import { RelativePositionOptions, useRelativePosition, UseRelativePositionArgs, WithAlignment } from '@hooks';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { FC, useRef } from 'react';



export type RelativelyPositioned = RelativePositionOptions & Pick<
    UseRelativePositionArgs,
    'leaderElementOrRectRef'
> & PropsWithChildrenAsNodeOrFunction<WithAlignment>;

export const RelativelyPositioned: FC<RelativelyPositioned> = ({
    leaderElementOrRectRef,
    preferredAlignment,
    swappableAlignment,
    centered,
    spacing = 20,
    boundsSize = 20,
    unbounded,
    children,
}) => {
    const followerElementRef = useRef<HTMLDivElement>(null);
    const { alignment } = useRelativePosition({
        preferredAlignment,
        followerElementRef,
        leaderElementOrRectRef,
        swappableAlignment,
        centered,
        spacing,
        boundsSize,
        unbounded,
    });

    const childrenArgs: WithAlignment = {
        alignment,
    };

    return (
        <div className='fixed' ref={followerElementRef}>
            <ChildrenAsNodeOrFunction args={childrenArgs}>
                {children}
            </ChildrenAsNodeOrFunction>
        </div>
    );
};