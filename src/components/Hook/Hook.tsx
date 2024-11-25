import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';



type HookProps<_Value> = RT.PropsWithRequiredRenderFunction<[_Value]> & {
    hook: () => _Value;
};

export const Hook = <_Value,>({
    hook,
    children,
}: HookProps<_Value>) => {
    const hookValue = hook();
    return renderFunction(children, hookValue);
};