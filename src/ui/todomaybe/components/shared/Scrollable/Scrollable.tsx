import { PropsWithChildrenAsNodeOrFunction, PropsWithClassName, Size } from '@types';
import { cn, conditional, noop, twClassNames } from '@utils';
import { FC, MutableRefObject, RefObject, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useSharedResizeObserver, useThrottle, useLatest } from '@hooks';
import 'simplebar-react/dist/simplebar.min.css';
import { SimpleBarCore } from '@reExport';
import SimpleBar from 'simplebar-react';
import { renderFunction, mergeRefs } from '@lesnoypudge/utils-react';



type ConditionalProps = {
    small?: false;
    hidden?: false;
} | {
    small?: true;
    hidden?: false;
} | {
    small?: false;
    hidden?: true;
}

export type Scrollable = (
    PropsWithClassName 
    & PropsWithChildrenAsNodeOrFunction<RefObject<SimpleBarCore>>
    & ConditionalProps
    & {
        innerClassName?: string;
        label?: string;
        direction?: 'horizontal' | 'vertical',
        autoHide?: boolean;
        withOppositeGutter?: boolean;
        focusable?: boolean;
        followContentSize?: boolean;
        setScrollableWrapper?: (
            MutableRefObject<HTMLElement | null> 
            | ((el: HTMLElement | null) => void)
        );
        setScrollable?: (
            MutableRefObject<HTMLElement | null> 
            | ((el: HTMLElement | null) => void)
        );
        onContentResize?: (size: Size) => void;
    }
)

const styles = {
    wrapper: {
        base: 'flex flex-1 relative max-h-full',
        sizeFollow: 'flex-auto',
    },
    scrollable: 'absolute inset-0 simplebar-custom',
};

export const Scrollable: FC<Scrollable> = ({
    className = '',
    innerClassName = '',
    label,
    direction = 'vertical',
    autoHide = false,
    hidden = false,
    withOppositeGutter = false,
    small = false,
    focusable = false,
    followContentSize = false,
    children,
    onContentResize,
    setScrollable = noop,
    setScrollableWrapper = noop,
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { throttle, isThrottling: isAlive } = useThrottle();
    const simpleBarApiRef = useRef<SimpleBarCore>(null)
    const localWrapperRef = useRef<HTMLDivElement>(null)
    const localContentRef = useRef<HTMLDivElement>(null)
    const handleKeepAliveRef = useLatest(() => {
        if (autoHide) throttle(noop, 1000)();
    });

    const dataAttributes = {
        'data-direction': direction,
        'data-auto-hide': autoHide,
        'data-with-opposite-gutter': withOppositeGutter,
        'data-is-alive': isAlive,
    };

    const scrollbarSizesRef = useLatest({
        '--scrollbar-thickness': small ? 10 : hidden ? 0 : 10,
        '--track-thickness': small ? 6 : hidden ? 0 : 8,
        '--thumb-thickness': small ? 6 : hidden ? 0 : 8,
    });

    const scrollbarStyles: Record<keyof typeof scrollbarSizesRef.current, string> = {
        '--scrollbar-thickness': scrollbarSizesRef.current['--scrollbar-thickness'] + 'px',
        '--track-thickness': scrollbarSizesRef.current['--track-thickness'] + 'px',
        '--thumb-thickness': scrollbarSizesRef.current['--thumb-thickness'] + 'px',
    };

    const getCorrectContentSize = useCallback((width: number, height: number) => {
        const isHorizontal = direction === 'horizontal';
        const isVertical = direction === 'vertical';
        const scrollbarSize = scrollbarSizesRef.current['--scrollbar-thickness'];
        const scrollbarSizeWithGutter = scrollbarSize * 2;

        const padding = {
            vertical: conditional(
                conditional(
                    scrollbarSizeWithGutter,
                    scrollbarSize,
                    withOppositeGutter,
                ),
                0,
                isHorizontal,
            ),
            horizontal: conditional(
                conditional(
                    scrollbarSizeWithGutter,
                    scrollbarSize,
                    withOppositeGutter,
                ),
                0,
                isVertical,
            ),
        };

        return {
            width: width + padding.horizontal,
            height: height + padding.vertical,
        };
    }, [direction, scrollbarSizesRef, withOppositeGutter]);

    useSharedResizeObserver(localContentRef, (entry) => {
        if (!onContentResize && !followContentSize) return;

        const size = getCorrectContentSize(
            entry.borderBoxSize[0].inlineSize, 
            entry.borderBoxSize[0].blockSize
        );

        if (wrapperRef.current) {
            wrapperRef.current.style.height = size.height + 'px';
            // wrapperRef.current.style.width = size.width + 'px';
        }

        (onContentResize || noop)(size);
    });

    useEffect(() => {
        if (!simpleBarApiRef.current) return;

        const defaultListener = simpleBarApiRef.current.drag;

        simpleBarApiRef.current.drag = (...rest) => {
            handleKeepAliveRef.current();
            defaultListener(...rest);
        };
    }, [handleKeepAliveRef]);

    useLayoutEffect(() => {
        if (!localWrapperRef.current) return;

        if (focusable) {
            localWrapperRef.current.tabIndex = 0;
            return;
        }

        localWrapperRef.current.removeAttribute('tabIndex');
    }, [focusable]);

    return (
        <div
            className={twClassNames(
                styles.wrapper.base,
                { [styles.wrapper.sizeFollow]: followContentSize },
                className,
            )}
            ref={wrapperRef}
        >
            <SimpleBar
                className={styles.scrollable}
                style={scrollbarStyles as React.CSSProperties}
                forceVisible
                autoHide={false}
                clickOnTrack
                ariaLabel={label}
                {...dataAttributes}
                onPointerMove={handleKeepAliveRef.current}
                // ref={simpleBarApiRef}
            >
                {({contentNodeProps, scrollableNodeProps}) => (
                    <div
                        className={scrollableNodeProps.className}
                        ref={mergeRefs(
                            scrollableNodeProps.ref, 
                            setScrollableWrapper,
                            localWrapperRef
                        )}
                    >
                        <div
                            {...contentNodeProps}
                            className={cn(
                                contentNodeProps.className,
                                innerClassName
                            )}
                            ref={mergeRefs(
                                contentNodeProps.ref, 
                                setScrollable,
                                localContentRef
                            )}
                        >
                            {renderFunction(children, simpleBarApiRef)}
                        </div>
                    </div>
                )}
            </SimpleBar>
        </div>
    );
};