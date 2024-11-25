import React from 'react';



export const isRef = (v: unknown): v is React.MutableRefObject<unknown> => {
    return typeof v === 'object' && v !== null && 'current' in v;
};