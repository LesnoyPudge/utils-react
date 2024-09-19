import {  OverlayContext, OverlayPortal } from '@components';
import { getHTML } from '@utils';
import { FC, PropsWithChildren, useContext, useRef } from 'react';
import ReactFocusLock from 'react-focus-lock';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';



export interface OverlayItem extends PropsWithChildren {
    blockable?: boolean;
    blocking?: boolean;
    closeOnEscape?: boolean;
    closeOnClickOutside?: boolean;
    isRendered?: boolean;
    focused?: boolean;
}

export const OverlayItem: FC<OverlayItem> = ({
    blockable = false,
    blocking = false,
    closeOnEscape = false,
    closeOnClickOutside = false,
    isRendered = true,
    focused = false,
    children,
}) => {
    const { closeOverlay, isOverlayExist } = useContext(OverlayContext);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const isLockDisabled = !focused || !isRendered;

    const isBlocked = () => {
        const wrapper = wrapperRef.current;
        const overlayItems = [...getHTML().overlay.childNodes] as HTMLDivElement[];
        const filteredItems = overlayItems.filter(node => node === wrapper || node.dataset.blocking === 'true');
        return wrapper !== filteredItems.at(-1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!closeOnEscape) return;
        if (!wrapperRef.current) return;
        if (!e.target) return;
        if (e.code !== 'Escape') return;
        if (!blockable) return closeOverlay();
        if (!isBlocked()) return closeOverlay();
    };

    const onClick = () => {
        if (!wrapperRef.current) return;
        if (!closeOnClickOutside) return;
        if (!isBlocked()) return closeOverlay();
    };

    useOnClickOutside(wrapperRef, onClick, 'mouseup');
    useEventListener('keydown', handleKeyDown);

    return (
        <If condition={isRendered}>
            <OverlayPortal>
                <div
                    className='overlay-item-wrapper'
                    data-blocking={blocking && isOverlayExist}
                    ref={wrapperRef}
                >
                    <ReactFocusLock
                        returnFocus
                        autoFocus={focused}
                        disabled={isLockDisabled}
                    >
                        {children}
                    </ReactFocusLock>
                </div>
            </OverlayPortal>
        </If>
    );
};