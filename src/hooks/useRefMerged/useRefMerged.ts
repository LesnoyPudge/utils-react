import { mergeRefs } from '@utils';
import { RefCallback, RefObject } from 'react';
import { useConst, useFunction } from '@hooks';



export const useRefMerged = <
    _Value,
    _Ref extends (
        RefObject<_Value>
        | RefCallback<_Value>
        | undefined
    ),
>(...refs: _Ref[]) => {
    return useFunction(mergeRefs(...refs) as RefCallback<_Value>);
};