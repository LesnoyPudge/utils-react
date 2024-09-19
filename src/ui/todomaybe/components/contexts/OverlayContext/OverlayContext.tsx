import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { createContext, FC, MutableRefObject, useCallback } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';
import { useStateAndRef, useThrottle } from '@hooks';
import { fpsToMs } from '@utils';



export interface OverlayContext {
    isOverlayExist: boolean;
    closingThrottleRef: MutableRefObject<boolean>;
    openOverlay: () => void;
    closeOverlay: () => void;
    toggleOverlay: () => void;
}

interface OverlayContextProvider extends PropsWithChildrenAsNodeOrFunction<OverlayContext> {
    disabled?: boolean;
    isOverlayExistInitial?: boolean;
}

export const OverlayContext = createContext<OverlayContext>();

export const OverlayContextProvider: FC<OverlayContextProvider> = ({
    children,
    disabled = false,
    isOverlayExistInitial = false,
}) => {
    const [
        isOverlayExist,
        isOverlayExistRef,
        setIsOverlayExist,
    ] = useStateAndRef(isOverlayExistInitial);
    const { isThrottlingRef, throttle } = useThrottle();

    const handleClose = useCallback(() => {
        if (!isOverlayExistRef.current) return;
        if (disabled) return;

        throttle(() => {
            setIsOverlayExist(false);
        }, fpsToMs(60))();
    }, [isOverlayExistRef, setIsOverlayExist, throttle, disabled]);

    const handleOpen = useCallback(() => {
        if (isThrottlingRef.current) return;
        if (disabled) return;

        setIsOverlayExist(true);
    }, [isThrottlingRef, setIsOverlayExist, disabled]);

    const handleToggle = useCallback(() => {
        if (isThrottlingRef.current) return;
        if (disabled) return;

        setIsOverlayExist((v) => !v);
    }, [isThrottlingRef, setIsOverlayExist, disabled]);

    const contextValues: OverlayContext = {
        isOverlayExist,
        closingThrottleRef: isThrottlingRef,
        openOverlay: handleOpen,
        closeOverlay: handleClose,
        toggleOverlay: handleToggle,
    };

    return (
        <OverlayContext.Provider value={contextValues}>
            <ChildrenAsNodeOrFunction args={contextValues}>
                {children}
            </ChildrenAsNodeOrFunction>
        </OverlayContext.Provider>
    );
};