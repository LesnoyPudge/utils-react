import { createContext } from 'react';
import * as EB from 'react-error-boundary';
import type { ErrorBoundary } from '@entities/ErrorBoundary/components';



export type ErrorBoundaryContext = Required<
    Pick<EB.ErrorBoundaryContextType, 'error' | 'resetErrorBoundary'>
    & Pick<ErrorBoundary.OuterContext, 'counter'>
>;

export const ErrorBoundaryContext = createContext<
    ErrorBoundaryContext
>();