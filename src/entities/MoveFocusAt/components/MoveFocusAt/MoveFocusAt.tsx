import { renderFunction } from '@utils';
import { FC } from 'react';
import { useMoveFocusAt, useRefManager } from '@entities';
import { RT } from '@lesnoypudge/types-utils-react/namespace';



export namespace MoveFocusAt {
    type WithElementRef = {
        elementRef: useMoveFocusAt.Args[0];
    };

    type RenderProps = (
        {
            focus: VoidFunction;
        }
        & WithElementRef
    );

    type WithChildren = RT.PropsWithRequiredRenderFunction<[RenderProps]>;

    export type Props = (
        {
            enabled: useMoveFocusAt.Args[1];
        }
        & Partial<WithElementRef>
        & WithChildren
    );
}

export const MoveFocusAt: FC<MoveFocusAt.Props> = ({
    elementRef,
    enabled,
    children,
}) => {
    const refManager = useRefManager<HTMLElement>(null);
    const manager = elementRef ?? refManager;
    const { focus } = useMoveFocusAt(manager, enabled);

    return renderFunction(children, {
        elementRef: manager,
        focus,
    });
};