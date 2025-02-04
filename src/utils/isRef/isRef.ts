import { MutableRefObject } from 'react';



/**
 * Checks if a value is a ref object with a current property.
 */
export const isRef = (v: unknown): v is MutableRefObject<unknown> => {
    return typeof v === 'object' && v !== null && 'current' in v;
};