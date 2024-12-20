import { T } from '@lesnoypudge/types-utils-base/namespace';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';
import { RefObject, useRef } from 'react';
import { useFocusInside } from 'react-focus-lock';



export namespace FocusInside {
    export type Options = {
        /**
         * @default false;
         */
        enabled?: boolean;
    };

    type WithContainerRef<_Element extends HTMLElement> = {
        containerRef: RefObject<_Element>;
    };

    export type Props<_Element extends HTMLElement> = T.Simplify<(
        RT.PropsWithRenderFunctionOrNode<[WithContainerRef<_Element>]>
        & Partial<WithContainerRef<_Element>>
        & Options
    )>;
}

export const FocusInside = <_Element extends HTMLElement>({
    containerRef,
    enabled = false,
    children,
}: FocusInside.Props<_Element>) => {
    const ref = useRef<_Element>(null);
    const _ref = containerRef ?? ref;

    // @ts-expect-error
    useFocusInside(enabled ? _ref : undefined);

    return renderFunction(children, {
        containerRef: _ref,
    });
};