


export const defaultSelector = <
    _Value,
    _Return = _Value,
>(
    v: _Value,
) => v as unknown as _Return;