import { useFunction, useUniqueState } from '@hooks';



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