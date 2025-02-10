import { isRef } from '@utils/isRef';
import { MutableRefObject, RefCallback } from 'react';



export namespace mergeRefs {
    export type PassedRef<_Element = HTMLElement> = (
        MutableRefObject<_Element | null>
        | RefCallback<_Element | null>
        | null
        | undefined
    );
}

/**
 * Merges multiple refs into one.
 * When the returned function is called, it assigns the node to all refs.
 */
export const mergeRefs = <
    _Element = HTMLElement,
>(...refs: mergeRefs.PassedRef<_Element>[]) => {
    return (node: _Element | null) => {
        refs.forEach((ref) => {
            if (!ref) return;

            if (isRef(ref)) {
                ref.current = node;
                return;
            }

            ref(node);
        });
    };
};