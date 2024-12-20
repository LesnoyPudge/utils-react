import { createContextSelectable } from '@entities/ContextSelectable';
import { MutableRefObject } from 'react';



export type FocusContext = {
    focusQueue: MutableRefObject<string[]>;
    focusMap: MutableRefObject<Map<'inside' | 'at', string>>;
};

export const FocusContext = createContextSelectable<FocusContext>();