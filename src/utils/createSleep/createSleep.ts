import { FC, PropsWithChildren } from 'react';



export const createSleep = (duration: number, logId?: string) => {
    let isResolved = false;
    let timeoutId: number;

    const Sleep: FC<PropsWithChildren> = ({ children }) => {
        if (!isResolved) {
            logId && console.log(`[${logId}}] sleeping for: ${duration}`);

            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw new Promise<void>((res) => {
                clearTimeout(timeoutId);

                timeoutId = setTimeout(() => {
                    isResolved = true;

                    logId && console.log(`[${logId}] sleep resolve`);

                    res();
                }, duration);
            });
        }

        return children;
    };

    return Sleep;
};