import { CSSProperties, FC, PropsWithChildren } from 'react';


const style: CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
};

export const VisuallyHidden: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div style={style}>
            {children}
        </div>
    );
};