import { FC, useContext } from 'react';
import { HeadingContext } from '@entities';



export const HeadingProvider: FC = () => {
    const upperLevel = useContext(HeadingContext);

    if (upperLevel === 6) {
        console.error('Maximum heading level exceeded');
    }

    const nextLevel = upperLevel + 1;

    return (
        <HeadingContext.Provider value={nextLevel}>
        </HeadingContext.Provider>
    );
};