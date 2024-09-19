import { getHTML } from '@utils';
import { FC, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';



const overlay = getHTML().overlay;

export const OverlayPortal: FC<PropsWithChildren> = ({ children }) => {
    return createPortal(children, overlay);
};