import { useRefManager } from '@entities';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils';



export namespace RefManager {
    export type Props<_Value> = T.Simplify<
        {
            initialValue: useRefManager.Args<_Value>[0];
            initialSubscribedRefs?: useRefManager.Args<_Value>[1][];
        }
        & RT.PropsWithRequiredRenderFunction<[
            useRefManager.RefManager<_Value>,
        ]>
    >;
}

export const RefManager = <_Value,>({
    initialValue,
    children,
    initialSubscribedRefs = [],
}: RefManager.Props<_Value>) => {
    const refManager = useRefManager(initialValue, ...initialSubscribedRefs);

    return renderFunction(children, refManager);
};