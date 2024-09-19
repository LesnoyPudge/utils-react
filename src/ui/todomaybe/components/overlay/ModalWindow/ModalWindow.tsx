import { animated, UseTransitionProps } from '@react-spring/web';
import { FC, useContext } from 'react';
import { AnimatedTransition, ChildrenAsNodeOrFunction, OverlayContext, OverlayItem, Scrollable } from '@components';
import { cn, getTransitionOptions, twClassNames } from '@utils';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { renderFunction } from '@lesnoypudge/utils-react';



interface ModalWindow extends PropsWithChildrenAsNodeOrFunction<OverlayContext> {
    label: string;
    withBackdrop?: boolean;
    transitionOptions?: UseTransitionProps;
    noContainerPointerEvents?: boolean;
    noBackdropPointerEvents?: boolean;
}

const defaultTransitionOptions = getTransitionOptions.defaultModal();

const styles = {
    wrapper: 'fixed inset-0 pointer-events-none',
    inner: 'h-full relative isolate',
    backdrop: 'absolute inset-0 z-0 bg-black focus-hidden opacity-70 scale-[999]',
    contentWrapper: 'absolute inset-0 z-10 grid place-items-center',
    contentScrollable: 'overflow-hidden max-h-full',
};

export const ModalWindow: FC<ModalWindow> = ({
    label,
    withBackdrop = false,
    transitionOptions = defaultTransitionOptions,
    noContainerPointerEvents = false,
    noBackdropPointerEvents = false,
    children,
}) => {
    const overlayValues = useContext(OverlayContext);
    const { closeOverlay, isOverlayExist } = overlayValues;

    const getPointerClass = (pointerDisabled: boolean) => {
        return pointerDisabled ? 'pointer-events-none' : 'pointer-events-auto'
    }

    return (
        <AnimatedTransition
            isExist={isOverlayExist}
            transitionOptions={transitionOptions}
        >
            {({ style, isAnimatedExist }) => (
                <OverlayItem
                    isRendered={isAnimatedExist}
                    blockable
                    blocking
                    closeOnEscape
                    closeOnClickOutside
                    focused
                >
                    <animated.div
                        className={styles.wrapper}
                        style={style}
                        role='dialog'
                        aria-label={label}
                    >
                        <div className={styles.inner}>
                            <If condition={withBackdrop}>
                                <div
                                    className={twClassNames(
                                        styles.backdrop,
                                        getPointerClass(noBackdropPointerEvents),
                                    )}
                                    onClick={closeOverlay}
                                ></div>
                            </If>
                            
                            {/* <Scrollable
                                className={cn(
                                    'absolute inset-0 z-10', 
                                )}
                                innerClassName={getPointerClass(noContainerPointerEvents)}
                            >
                                {renderFunction(children, overlayValues)}
                            </Scrollable> */}

                            <div className={styles.contentWrapper}>
                                <div className={twClassNames(
                                    styles.contentScrollable,
                                    getPointerClass(noContainerPointerEvents),
                                )}>
                                    <ChildrenAsNodeOrFunction args={overlayValues}>
                                        {children}
                                    </ChildrenAsNodeOrFunction>
                                </div>
                            </div>
                        </div>
                    </animated.div>
                </OverlayItem>
            )}
        </AnimatedTransition>
    );
};