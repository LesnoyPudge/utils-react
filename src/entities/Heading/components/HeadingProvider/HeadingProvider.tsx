import { FC, PropsWithChildren, useContext } from 'react';
import { HeadingContext } from '../HeadingContext';
import { invariant } from '@lesnoypudge/utils';



export const HeadingProvider: FC<PropsWithChildren> = ({
    children,
}) => {
    const upperLevel = useContext(HeadingContext);

    invariant(
        upperLevel === 6,
        'Maximum heading level exceeded',
    );

    const nextLevel = upperLevel + 1;

    return (
        <HeadingContext.Provider value={nextLevel}>
            {children}
        </HeadingContext.Provider>
    );
};