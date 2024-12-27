import { useFunction } from '@hooks/useFunction';
import { isCallable } from '@lesnoypudge/utils';
import { useState } from 'react';



export const useBoolean = (
    initialValue: boolean,
    providedOnChange?: (value: boolean) => void,
) => {
    const [value, _setValue] = useState(initialValue);

    const setValue: typeof _setValue = useFunction((providedValue) => {
        _setValue((prev) => {
            const newValue = (
                isCallable(providedValue)
                    ? providedValue(prev)
                    : providedValue
            );

            providedOnChange?.(newValue);

            return newValue;
        });
    });

    const setTrue = useFunction(() => {
        setValue(true);
    });

    const setFalse = useFunction(() => {
        setValue(false);
    });

    const toggle = useFunction(() => {
        setValue((prev) => {
            const newValue = !prev;

            providedOnChange?.(newValue);

            return newValue;
        });
    });

    return {
        value,
        setValue,
        setTrue,
        setFalse,
        toggle,
    };
};