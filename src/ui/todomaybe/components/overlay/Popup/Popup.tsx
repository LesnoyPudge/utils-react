import { animated } from '@react-spring/web';
import { FC, PropsWithChildren, useContext } from 'react';
import { AnimatedTransition, RelativelyPositioned, OverlayItem, OverlayContext } from '@components';
import { getTransitionOptions } from '@utils';
import { StrictOmit } from 'ts-essentials';



type Popup = (
    PropsWithChildren 
    & Partial<Pick<AnimatedTransition<object>, 'transitionOptions'>> 
    & Partial<StrictOmit<OverlayItem, 'children' | 'isRendered'>> 
    & StrictOmit<RelativelyPositioned, 'children'> 
    & {
        role?: 'dialog' | 'menu';
        label?: string;
    }
)

const defaultTransitionOptions = getTransitionOptions.withOpacity();

const styles = {
    wrapper: 'pointer-events-auto'
}

export const Popup: FC<Popup> = ({
    transitionOptions = defaultTransitionOptions,
    label,
    role,
    blockable = true,
    blocking = true,
    closeOnClickOutside = true,
    closeOnEscape = true,
    focused = true,
    leaderElementOrRectRef,
    preferredAlignment,
    boundsSize = 20,
    centered = false,
    spacing = 15,
    swappableAlignment = true,
    unbounded = false,
    children,
}) => {
    const { isOverlayExist } = useContext(OverlayContext);

    return (
        <AnimatedTransition
            isExist={isOverlayExist}
            transitionOptions={transitionOptions}
        >
            {({ style, isAnimatedExist }) => (
                <OverlayItem
                    isRendered={isAnimatedExist}
                    closeOnClickOutside={closeOnClickOutside}
                    closeOnEscape={closeOnEscape}
                    focused={focused}
                    blocking={blocking}
                    blockable={blockable}
                >
                    <RelativelyPositioned
                        leaderElementOrRectRef={leaderElementOrRectRef}
                        preferredAlignment={preferredAlignment}
                        boundsSize={boundsSize}
                        centered={centered}
                        spacing={spacing}
                        swappableAlignment={swappableAlignment}
                        unbounded={unbounded}
                    >
                        <animated.div
                            className={styles.wrapper}
                            style={style}
                            role={role}
                            aria-label={label}
                        >
                            {children}
                        </animated.div>
                    </RelativelyPositioned>
                </OverlayItem>
            )}
        </AnimatedTransition>
    );
};