import { mergeRefs } from '@utils';
import { RefCallback, RefObject } from 'react';
import { useFunction, useRefCallback } from '@hooks';



export const useRefMerged = <
    _Value,
>(...refs: (
    RefObject<_Value>
    | RefCallback<_Value>
    | ReturnType<typeof useRefCallback<_Value>>
)[]) => {
    return useFunction(mergeRefs(...refs) as RefCallback<_Value>);
};