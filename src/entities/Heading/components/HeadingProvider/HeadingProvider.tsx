import { FC, PropsWithChildren, useContext } from 'react';
import { HeadingContext } from '@entities/Heading/context';
import { START_LEVEL, MAX_LEVEL } from '@entities/Heading/vars';
import { T } from '@lesnoypudge/types-utils-base/namespace';



export namespace HeadingProvider {
    export type Props = (
        PropsWithChildren
        & {
            startFrom?: T.IntRange<
                typeof START_LEVEL,
                T.Sum<typeof MAX_LEVEL, 1>
            >;
        }
    );
}

export const HeadingProvider: FC<HeadingProvider.Props> = ({
    startFrom,
    children,
}) => {
    const upperLevel = useContext(HeadingContext) as number | undefined;

    const withStartFrom = startFrom !== undefined;

    if (!withStartFrom && (upperLevel === MAX_LEVEL)) {
        console.warn('Maximum heading level exceeded');
    }

    const nextLevel = startFrom ?? Math.min(
        MAX_LEVEL,
        (upperLevel ?? START_LEVEL) + 1,
    );

    return (
        <HeadingContext.Provider value={nextLevel}>
            {children}
        </HeadingContext.Provider>
    );
};