import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';
import { Fragment } from 'react/jsx-runtime';



export namespace Iterate {
    export type ChildrenArgs<_Item> = [
        item: _Item,
        index: number,
        items: _Item[],
    ];

    export type GetKey<_Item> = (item: _Item, index: number) => string | number;

    export type Props<_Item> = (
        RT.PropsWithRequiredRenderFunction<ChildrenArgs<_Item>>
        & {
            items: _Item[];
            getKey: GetKey<_Item>;
        }
    );
}

/**
 * Iterates over provided items and provides them to children.
 *
 * Wraps children with React.Fragment with key returned by `getKey`.
 */
export const Iterate = <_Item,>({
    items,
    getKey,
    children,
}: Iterate.Props<_Item>) => {
    return items.map((item, index, arr) => (
        <Fragment key={getKey(item, index)}>
            {renderFunction(children, item, index, arr)}
        </Fragment>
    ));
};