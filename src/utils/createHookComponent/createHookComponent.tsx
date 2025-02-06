import { T } from '@lesnoypudge/types-utils-base/namespace';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';
import { withDisplayName } from '@utils/withDisplayName';



/**
 * Creates a component that wraps a hook and renders its value.
 */
export const createHookComponent = <
    _Factory extends T.AnyFunction,
>(
    displayName: string,
    hookFactory: _Factory,
) => {
    return withDisplayName(displayName, ({
        children,
        args,
    }: (
        RT.PropsWithRequiredRenderFunction<[ReturnType<_Factory>]>
        & (
            T.IsEqual<Parameters<_Factory>['length'], 0> extends true
                ? { args?: never }
                : { args: Parameters<_Factory> }
        )
    )) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const hookValue = hookFactory(...args ?? []);
        return renderFunction(children, hookValue);
    });
};