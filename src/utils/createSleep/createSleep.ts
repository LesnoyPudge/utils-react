/* eslint-disable @typescript-eslint/only-throw-error */
import { never } from '@lesnoypudge/utils';
import { FC, PropsWithChildren } from 'react';


/**
 * Creates a component that suspends rendering
 * until a specified duration has passed.
 */
export const createSleep = (durationMs: number, logId?: string) => {
    let isResolved = false;
    let isResolving = false;
    let promise: Promise<void>;

    const Sleep: FC<PropsWithChildren> = ({ children }) => {
        if (!isResolved && !isResolving) {
            isResolving = true;

            logId && console.log(`[${logId}}] sleeping for: ${durationMs}`);

            promise = new Promise<void>((resolve) => {
                setTimeout(() => {
                    isResolved = true;
                    isResolving = false;

                    logId && console.log(`[${logId}] sleep resolve`);

                    resolve();
                }, durationMs);
            });

            throw promise;
        }

        if (isResolving) {
            throw promise;
        }

        if (isResolved) {
            return children;
        }

        never();
    };

    return Sleep;
};