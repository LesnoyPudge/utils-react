import { noop } from '@lesnoypudge/utils';
import { lazy } from 'react';



export const Status = {
    Uninitialized: -1,
    Pending: 0,
    Resolved: 1,
    Rejected: 2,
} as const;

// @ts-expect-error
export const REACT_LAZY_TYPE = lazy(noop).$$typeof;