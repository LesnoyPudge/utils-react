import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils';
import { RefObject, useRef } from 'react';



export const Ref = <_Value,>({
    children,
}: RT.PropsWithRequiredRenderFunction<[RefObject<_Value>]>) => {
    const ref = useRef<_Value>(null);

    return renderFunction(children, ref);
};