import { MutableRefObject } from 'react';



export const isRef = (v: unknown): v is MutableRefObject<unknown> => {
    return typeof v === 'object' && v !== null && 'current' in v;
};