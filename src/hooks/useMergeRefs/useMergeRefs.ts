import { useFunction } from '@hooks/useFunction';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { mergeRefs } from '@utils/mergeRefs';



export namespace useMergeRefs {
    export type PassedRef<
        _Element = HTMLElement,
    > = mergeRefs.PassedRef<_Element>;

    export type Props<
        _Element = HTMLElement,
    > = T.NonEmptyArray<PassedRef<_Element>>;

    export type Return<
        _Element = HTMLElement,
    > = mergeRefs.Return<_Element>;
}

/**
 * Hook version of `mergeRefs` function.
 *
 * Merges multiple refs into one.
 *
 * When the returned function is called, it assigns the node to all refs.
 */
export const useMergeRefs = <
    _Element = HTMLElement,
>(
    refs: useMergeRefs.Props<_Element>,
): useMergeRefs.Return<_Element> => {
    return useFunction(mergeRefs(...refs));
};