import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils';
import { Fragment, Key, useMemo } from 'react';



type ListProps<_Item> = (
    ({
        list: _Item[];
        count?: never;
    } | {
        list?: never;
        count: number;
    }) & RT.PropsWithRenderFunctionOrNode<
        [item: _Item, index: number, array: _Item[]]
    > & {
        getKey?: (item: _Item, index: number) => Key;
    }
);

const defaultGetKey = (item: unknown, index: number) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return String(item?.id ?? index);
};


/**
 * If getKey is not provided, it tries to get item.id as the key.
 * If there is no id, the index is used as the key.
 */
export const List = <_Item = undefined>({
    count,
    list,
    getKey = defaultGetKey,
    children,
}: ListProps<_Item>) => {
    const res = useMemo(() => {
        return list ?? Array(count) as _Item[];
    }, [count, list]);

    return res.map((item, index, array) => {
        return (
            <Fragment key={getKey(item, index)}>
                {renderFunction(children, item, index, array)}
            </Fragment>
        );
    });
};