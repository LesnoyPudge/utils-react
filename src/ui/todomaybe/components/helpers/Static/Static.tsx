import { memo, PropsWithChildren } from 'react';



export const Static = memo<PropsWithChildren>(({ children }) => {
    return (
        <>
            {children}
        </>
    );
}, () => true);

Static.displayName = 'Static';