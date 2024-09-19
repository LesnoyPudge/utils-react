import { AnimatedTransition, OverlayPortal, RelativelyPositioned } from '@components';
import { RelativePositionOptions } from '@hooks';
import { SpringValue, animated } from '@react-spring/web';
import { Alignment, PropsWithChildrenAndClassName, PropsWithLeaderElementRef } from '@types';
import { getTransitionOptions, twClassNames } from '@utils';
import { FC } from 'react';
import { useTooltip } from './hooks';



type Tooltip = (
    PropsWithChildrenAndClassName &
    PropsWithLeaderElementRef &
    RelativePositionOptions
);

const transitionOptions = getTransitionOptions.withOpacity({
    from: {
        offset: 15,
    },
    enter: {
        offset: 0,
    },
    leave: {
        offset: 15,
    },
    config: {
        duration: 150,
    },
});

const styles = {
    base: `bg-primary-500 text-color-base font-bold py-[5px] px-2.5 
    rounded-md w-max max-w-[300px] shadow-elevation-low`,
    overlayItem: 'overlay-item-wrapper',
};

const getTooltipStyle = (
    alignment: Alignment,
    style: {
        offset: SpringValue<number>;
        opacity: SpringValue<number>;
    },
) => {
    const alignmentStyles = {
        top: {
            translateY: style.offset.to((offset => `-${offset}px`)),
        },
        bottom: {
            translateY: style.offset.to((offset) => `${offset}px`),
        },
        left: {
            translateX: style.offset.to((offset) => `-${offset}px`),
        },
        right: {
            translateX: style.offset.to((offset) => `${offset}px`),
        },
    };

    return {
        opacity: style.opacity,
        ...alignmentStyles[alignment],
    };
};

export const Tooltip: FC<Tooltip> = ({
    className = '',
    leaderElementRef,
    children,
    preferredAlignment,
    boundsSize = 20,
    centered = true,
    spacing = 20,
    swappableAlignment = true,
    unbounded,
}) => {
    const [isExist] = useTooltip(leaderElementRef);

    return (
        <AnimatedTransition
            isExist={isExist}
            transitionOptions={transitionOptions}
        >
            {({ isAnimatedExist, style }) => (
                <If condition={isAnimatedExist}>
                    <OverlayPortal>
                        <div className={styles.overlayItem}>
                            <RelativelyPositioned
                                leaderElementOrRectRef={leaderElementRef}
                                preferredAlignment={preferredAlignment}
                                boundsSize={boundsSize}
                                centered={centered}
                                spacing={spacing}
                                swappableAlignment={swappableAlignment}
                                unbounded={unbounded}
                            >
                                {({ alignment }) => (
                                    <animated.div
                                        className={twClassNames(styles.base, className)}
                                        style={getTooltipStyle(alignment, style)}
                                        role='tooltip'
                                    >
                                        {children}
                                    </animated.div>
                                )}
                            </RelativelyPositioned>
                        </div>
                    </OverlayPortal>
                </If>
            )}
        </AnimatedTransition>
    );
};