import { FC } from 'react';



export const Space: FC = () => {
    return (
        <>
            {String.fromCodePoint(160) /* Non-breaking space */}
        </>
    );
};