import { useFunction } from '@hooks/useFunction';
import { useUniqueState } from '@hooks/useUniqueState';



export const useBoolean = (
    initialValue: useUniqueState.initialValue<boolean>,
) => {
    const [value, setValue] = useUniqueState(initialValue);

    const setTrue = useFunction(() => {
        setValue(true);
    });

    const setFalse = useFunction(() => {
        setValue(false);
    });

    const toggle = useFunction(() => {
        setValue((prev) => !prev);
    });

    return {
        value,
        setValue,
        setTrue,
        setFalse,
        toggle,
    };
};