import { useFunction } from '@hooks/useFunction';
import { useState } from 'react';



export const useBoolean = (
    initialValue: boolean,
    onChange?: (value: boolean) => void,
) => {
    const [value, setValue] = useState(initialValue);

    const setTrue = useFunction(() => {
        setValue(true);
        onChange?.(true);
    });

    const setFalse = useFunction(() => {
        setValue(false);
        onChange?.(false);
    });

    const toggle = useFunction(() => {
        let newValue = false;

        setValue((prev) => {
            newValue = !prev;
            return newValue;
        });
        onChange?.(newValue);
    });

    return {
        value,
        setValue,
        setTrue,
        setFalse,
        toggle,
    };
};