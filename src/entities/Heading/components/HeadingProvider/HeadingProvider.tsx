import { FC, PropsWithChildren, useContext } from 'react';
import { HeadingContext } from '../HeadingContext';



export const HeadingProvider: FC<PropsWithChildren> = ({
    children,
}) => {
    const upperLevel = useContext(HeadingContext);

    if (upperLevel === 6) {
        console.error('Maximum heading level exceeded');
    }

    const nextLevel = upperLevel + 1;

    return (
        <HeadingContext.Provider value={nextLevel}>
            {children}
        </HeadingContext.Provider>
    );
};