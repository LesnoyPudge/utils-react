import { useFunction } from '@hooks/useFunction';
import { useUniqueState } from '@hooks/useUniqueState';



export const useBoolean = (
    initialValue: useUniqueState.initialValue<boolean>,
    onChange?: (value: boolean) => void,
) => {
    const [value, setValue] = useUniqueState(initialValue);

    const setTrue = useFunction(() => {
        setValue(true);
        onChange?.(true);
    });

    const setFalse = useFunction(() => {
        setValue(false);
        onChange?.(true);
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