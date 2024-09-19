import { AnimatedTransition, ChildrenAsNodeOrFunction, OverlayContext, OverlayItem, RelativelyPositioned } from '@components';
import { useEventListener, UseRelativePositionArgs } from '@hooks';
import { animated } from '@react-spring/web';
import { OmittedRect, PropsWithChildrenAsNodeOrFunction, PropsWithClassName, PropsWithLeaderElementRef } from '@types';
import { getTransitionOptions, twClassNames } from '@utils';
import { FC, useContext, useEffect, useRef } from 'react';



type ContextMenu = (
    PropsWithClassName &
    PropsWithChildrenAsNodeOrFunction<OverlayContext> &
    PropsWithLeaderElementRef &
    Pick<UseRelativePositionArgs, 'preferredAlignment' | 'centered'>
)

const transitionOptions = getTransitionOptions.defaultContextMenu();

const styles = {
    base: 'pointer-events-auto bg-primary-500 rounded text-color-base p-5',
};

export const ContextMenu: FC<ContextMenu> = ({
    className = '',
    preferredAlignment,
    leaderElementRef,
    centered,
    children,
}) => {
    const contextValues = useContext(OverlayContext);
    const leaderElementOrRectRef = useRef<HTMLElement | OmittedRect | null>(leaderElementRef.current);

    const handleContextMenu = (e: MouseEvent) => {
        const { closingThrottleRef, openOverlay } = contextValues;

        if (closingThrottleRef.current) return;

        const withMouse = e.button !== -1;
        const withKeyboard = !withMouse;

        if (withMouse) {
            const cursorSize = 1;

            leaderElementOrRectRef.current = {
                top: e.clientY,
                bottom: e.clientY + cursorSize,
                left: e.clientX,
                right: e.clientX + cursorSize,
                width: cursorSize,
                height: cursorSize,
            };
        }

        if (withKeyboard) {
            leaderElementOrRectRef.current = e.currentTarget as HTMLElement;
        }

        openOverlay();
    };

    useEventListener('contextmenu', handleContextMenu, leaderElementRef);

    return (
        <AnimatedTransition
            isExist={contextValues.isOverlayExist}
            transitionOptions={transitionOptions}
        >
            {({ isAnimatedExist, style }) => (
                <OverlayItem
                    isRendered={isAnimatedExist}
                    blockable
                    blocking
                    closeOnClickOutside
                    closeOnEscape
                    focused
                >
                    <RelativelyPositioned
                        leaderElementOrRectRef={leaderElementOrRectRef}
                        preferredAlignment={preferredAlignment}
                        spacing={15}
                        boundsSize={20}
                        swappableAlignment
                        centered={centered}
                    >
                        <animated.div
                            className={twClassNames(styles.base, className)}
                            style={style}
                            role='menu'
                        >
                            <ChildrenAsNodeOrFunction args={contextValues}>
                                {children}
                            </ChildrenAsNodeOrFunction>
                        </animated.div>
                    </RelativelyPositioned>
                </OverlayItem>
            )}
        </AnimatedTransition>
    );
};