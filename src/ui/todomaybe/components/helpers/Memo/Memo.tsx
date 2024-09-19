import { memo, PropsWithChildren } from 'react';
import reactCompare from 'react-fast-compare';



export const Memo = memo<PropsWithChildren>(({ children }) => {
    return (
        <>
            {children}
        </>
    );
}, reactCompare);

Memo.displayName = 'Memo';
