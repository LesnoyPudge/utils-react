import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';



export namespace Iterate {
    export type ChildrenArgs<_Item> = [
        item: _Item,
        index: number,
        items: _Item[],
    ];

    export type Props<_Item> = (
        RT.PropsWithRequiredRenderFunction<ChildrenArgs<_Item>>
        & {
            items: _Item[];
        }
    );
}

export const Iterate = <_Item,>({
    items,
    children,
}: Iterate.Props<_Item>) => {
    return items.map((...args) => renderFunction(children, ...args));
};