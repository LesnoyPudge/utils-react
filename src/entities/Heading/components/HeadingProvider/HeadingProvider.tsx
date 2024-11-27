import { FC, PropsWithChildren, useContext } from 'react';
import { HeadingContext } from '@entities/Heading/context';
import { START_LEVEL, MAX_LEVEL } from '@entities/Heading/vars';
import { never } from '@lesnoypudge/utils';



export const HeadingProvider: FC<PropsWithChildren> = ({
    children,
}) => {
    const upperLevel = useContext(HeadingContext) as number | undefined;

    if (upperLevel === MAX_LEVEL) {
        never('Maximum heading level exceeded');
    }

    const nextLevel = (upperLevel ?? START_LEVEL) + 1;

    return (
        <HeadingContext.Provider value={nextLevel}>
            {children}
        </HeadingContext.Provider>
    );
};