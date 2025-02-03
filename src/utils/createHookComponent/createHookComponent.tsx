import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';
import { withDisplayName } from '@utils/withDisplayName';



/**
 * Creates a component that wraps a hook and renders its value.
 */
export const createHookComponent = <_Value,>(
    displayName: string,
    hookFactory: () => _Value,
) => {
    return withDisplayName(displayName, ({
        children,
    }: RT.PropsWithRequiredRenderFunction<[_Value]>) => {
        const hookValue = hookFactory();
        return renderFunction(children, hookValue);
    });
};