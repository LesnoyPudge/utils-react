import { isRef } from '@utils/isRef';
import { MutableRefObject, RefCallback } from 'react';



export namespace mergeRefs {
    export type Ref<_Element extends HTMLElement = HTMLElement> = (
        MutableRefObject<HTMLElement | null>
        | RefCallback<HTMLElement | null>
    );
}

/**
 * Merges multiple refs into one.
 * When the returned function is called, it assigns the node to all refs.
 */
export const mergeRefs = <
    _Element extends HTMLElement,
>(...refs: mergeRefs.Ref<_Element>[]) => {
    return (node: _Element | null) => {
        refs.forEach((ref) => {
            if (isRef(ref)) {
                ref.current = node;
                return;
            }

            ref(node);
        });
    };
};