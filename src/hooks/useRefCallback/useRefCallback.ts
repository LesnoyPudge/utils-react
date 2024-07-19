import { useFunction } from '@hooks';
import { isCallable } from '@lesnoypudge/utils';
import { mergeRefs } from '@utils';
import { useRef } from 'react';



export const useRefCallback = <_Value>(
    refEffect: (
        ((value: _Value) => void)
        | ((value: _Value) => () => void)
    ),
) => {
    const unmountEffectRef = useRef<() => void>();
    const refsToCombineRef = useRef<Parameters<typeof mergeRefs<_Value>>>([]);

    const applyRefEffect = useFunction((value: _Value | null) => {
        if (value !== null) {
            console.log('ref effect');
            const res = refEffect(value);

            res && (unmountEffectRef.current = res);

            return;
        }

        unmountEffectRef.current?.();
    });

    const combinedRefs = useFunction((value: _Value | null) => {
        const ref = mergeRefs(applyRefEffect, ...refsToCombineRef.current);

        if (isCallable(ref)) ref(value);
    });

    const refCallback = useFunction((
        ...args: [value: _Value | null] | Parameters<typeof mergeRefs<_Value>>
    ) => {
        const isValue = (
            args.length === 1
            && (
                args[0] instanceof HTMLElement
                || args[0] === null
            )
        );

        if (isValue) {
            applyRefEffect(args[0] as _Value | null);
            return;
        }

        refsToCombineRef.current = args as Parameters<typeof mergeRefs<_Value>>;

        return combinedRefs;
    });

    return refCallback;
};