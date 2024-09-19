import { PropsWithChildrenAndClassName } from '@types';
import { FC } from 'react';



interface TabPanel extends PropsWithChildrenAndClassName {
    id: string;
    labelledBy: string;
}

export const TabPanel: FC<TabPanel> = ({
    className = '',
    id,
    labelledBy,
    children,
}) => {
    return (
        <div
            className={className}
            id={id}
            aria-labelledby={labelledBy}
            role='tabpanel'
        >
            {children}
        </div>
    );
};