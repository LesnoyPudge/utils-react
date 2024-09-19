import { useRefWithSetter, useFocusVisibleEvent, useSharedIntersectionObserver, useEventListener } from '@hooks';
import { RefObject, useState } from 'react';



export const useTooltip = (
    leaderElementRef: RefObject<HTMLElement>,
) => {
    const [isExist, setIsExist] = useState(false);
    const [withKeyboardRef, setWithKeyboard] = useRefWithSetter(false);
    const [withMouseRef, setWithMouse] = useRefWithSetter(false);

    const changeState = () => {
        const newState = withKeyboardRef.current || withMouseRef.current;
        if (newState === isExist) return;

        setIsExist(newState);
    };

    const handleFocusIn = (e: FocusEvent) => {
        if (!leaderElementRef.current) return;
        if (e.target !== leaderElementRef.current) return;

        setWithKeyboard(true);
        changeState();
    };

    const handleFocusOut = (e: FocusEvent) => {
        if (!leaderElementRef.current) return;
        if (e.target !== leaderElementRef.current) return;

        setWithKeyboard(false);
        changeState();
    };

    const handleMouseEnter = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;

        setWithMouse(true);
        changeState();
    };

    const handleMouseLeave = () => {
        setWithMouse(false);
        changeState();
    };

    useFocusVisibleEvent(handleFocusIn, handleFocusOut, leaderElementRef);
    useEventListener('pointerenter', handleMouseEnter, leaderElementRef);
    useEventListener('pointerleave', handleMouseLeave, leaderElementRef);

    useSharedIntersectionObserver(leaderElementRef, ({ isIntersecting }) => {
        if (isIntersecting === isExist) return;
        if (!withKeyboardRef.current && !withMouseRef.current) return;

        setIsExist(isIntersecting);
    });

    return [
        isExist,
    ];
};