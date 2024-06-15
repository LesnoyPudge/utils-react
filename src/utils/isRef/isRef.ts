import { isObject } from '@lesnoypudge/utils';
import React from 'react';



export const isRef = (v: unknown): v is React.MutableRefObject<unknown> => {
    return isObject(v) && 'current' in v;
};