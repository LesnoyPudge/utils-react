import { isProd, logger } from '@utils';
import { FC, PropsWithChildren, useEffect } from 'react';



interface ToDo extends PropsWithChildren {
    text?: string;
}

export const ToDo: FC<ToDo> = ({
    text,
    children,
}) => {
    useEffect(() => {
        if (isProd()) return;
        logger.log(`ToDo: ${text}`);
    }, [text]);

    return (
        <>
            {children}
        </>
    );
};