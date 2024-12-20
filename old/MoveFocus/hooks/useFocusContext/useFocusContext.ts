import { useContextSelector } from '@entities/ContextSelectable';
import { FocusContext } from '../../context';
import { useRef } from 'react';



export const useFocusContext = () => {
    const upperContext = useContextSelector(
        FocusContext,
    ) as FocusContext | undefined;

    const focusMap: FocusContext['focusMap'] = useRef(new Map());
    const focusQueue = useRef([]);

    return {
        focusMap: upperContext?.focusMap ?? focusMap,
        focusQueue: upperContext?.focusQueue ?? focusQueue,
    };
};