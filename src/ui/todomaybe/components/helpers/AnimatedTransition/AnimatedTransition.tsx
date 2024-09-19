import { PickAnimated, SpringValues, useTransition, UseTransitionProps } from '@react-spring/web';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { ChildrenAsNodeOrFunction } from '@components';
import { getTransitionOptions } from '@utils';



type ChildrenArgs<T extends UseTransitionProps<boolean>> = {
    style: SpringValues<PickAnimated<T>>;
    isAnimatedExist: boolean;
};

export type AnimatedTransition<T extends UseTransitionProps<boolean> | object> = PropsWithChildrenAsNodeOrFunction<
    ChildrenArgs<T>
> & {
    isExist?: boolean;
    transitionOptions: T;
}

export const AnimatedTransition = <T extends UseTransitionProps<boolean> | object>(props: AnimatedTransition<T>) => {
    const {
        transitionOptions,
        isExist = true,
        children,
    } = props;

    const transition = useTransition(isExist, transitionOptions);


    return transition((style, isAnimatedExist) => {
        const childrenArgs: ChildrenArgs<T> = { style, isAnimatedExist };

        return (
            <ChildrenAsNodeOrFunction args={childrenArgs}>
                {children}
            </ChildrenAsNodeOrFunction>
        );
    });
};