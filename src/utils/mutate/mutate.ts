


/**
 * Escape hatch for mutating objects avoiding react compiler's warnings.
 */
export const mutate = <
    _Object extends object,
    _Key extends keyof _Object,
    _Value extends _Object[_Key],
>(
    object: _Object,
    key: _Key,
    value: _Value,
): _Object => {
    object[key] = value;

    return object;
};