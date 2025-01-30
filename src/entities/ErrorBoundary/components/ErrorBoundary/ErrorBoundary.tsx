import {
    createContext,
    FC,
    PropsWithChildren,
    useContext,
} from 'react';
import * as EB from 'react-error-boundary';
import { ErrorBoundaryContext } from '@entities/ErrorBoundary/context';
import { useConst } from '@hooks/useConst';
import { Counter } from '@lesnoypudge/utils';
import { T } from '@lesnoypudge/types-utils-base/namespace';



export namespace ErrorBoundary {
    export type FallbackComponent = FC;

    export type onError = EB.ErrorBoundaryProps['onError'];

    export type onReset = EB.ErrorBoundaryProps['onReset'];

    type StableProps = (
        {
            onReset?: onReset;
        }
        & PropsWithChildren
    );

    type ConditionalProps = T.Simplify<T.RequireAtLeastOne<{
        FallbackComponent?: FallbackComponent;
        onError?: onError;
    }>>;

    export type Props = (
        StableProps
        & ConditionalProps
    );

    export type OuterContext = {
        FallbackComponent: FallbackComponent;
        counter: Counter;
    };
}

const OutreContext = createContext<ErrorBoundary.OuterContext>();

const Inner: FC<EB.FallbackProps> = ({
    error,
    resetErrorBoundary,
}) => {
    const {
        FallbackComponent,
        counter,
    } = useContext(OutreContext);

    const contextValue: ErrorBoundaryContext = {
        counter,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        error,
        resetErrorBoundary,
    };

    return (
        <ErrorBoundaryContext.Provider value={contextValue}>
            <FallbackComponent/>
        </ErrorBoundaryContext.Provider>
    );
};

const defaultFallback = () => null;

export const ErrorBoundary: FC<ErrorBoundary.Props> = ({
    FallbackComponent = defaultFallback,
    onError,
    onReset,
    children,
}) => {
    const contextValue: ErrorBoundary.OuterContext = useConst(() => ({
        counter: new Counter(),
        FallbackComponent,
    }));

    return (
        <OutreContext.Provider value={contextValue}>
            <EB.ErrorBoundary
                FallbackComponent={Inner}
                onError={onError}
                onReset={onReset}
            >
                {children}
            </EB.ErrorBoundary>
        </OutreContext.Provider>
    );
};