import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';
import { Fragment } from 'react/jsx-runtime';



export namespace Iterate {
    export type ChildrenArgsWithItems<_Item> = [
        item: _Item,
        index: number,
        items: _Item[],
    ];

    export type ChildrenArgsWithCount = [
        index: number,
    ];

    export type GetKeyWithItems<_Item,> = (
        item: _Item,
        index: number
    ) => string | number;

    export type GetKeyWithCount = (index: number) => string | number;

    export type PropsWithItems<_Item> = (
        RT.PropsWithRequiredRenderFunction<ChildrenArgsWithItems<_Item>>
        & {
            items: _Item[];
            count?: never;
            getKey: GetKeyWithItems<_Item>;
        }
    );

    export type PropsWithCount = (
        RT.PropsWithRequiredRenderFunction<ChildrenArgsWithCount>
        & {
            items?: never;
            count: number;
            getKey: GetKeyWithCount;
        }
    );

    export type Props<_Item> = (
        PropsWithItems<_Item>
        | PropsWithCount
    );
}

/**
 * Iterates over provided items or count and renders children as functions.
 *
 * Wraps children with React.Fragment with key returned by `getKey`.
 */
export const Iterate = <_Item,>({
    items,
    count,
    getKey,
    children,
}: Iterate.Props<_Item>) => {
    if (typeof count === 'number') {
        return Array.from({ length: count }, (_, index) => (
            <Fragment key={getKey(index)}>
                {renderFunction(children, index)}
            </Fragment>
        ));
    }

    return items.map((item, index, arr) => (
        <Fragment key={getKey(item, index)}>
            {renderFunction(children, item, index, arr)}
        </Fragment>
    ));
};