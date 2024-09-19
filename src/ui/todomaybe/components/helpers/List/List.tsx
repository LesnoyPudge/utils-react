import { ObjectWithId, PropsWithChildrenAsNodeOrFunction } from '@types';
import { ChildrenAsNodeOrFunction } from '@components';
import { isObjectWithId } from '@typeGuards';
import { Fragment, useRef } from 'react';
import { renderFunction } from '@lesnoypudge/utils-react';
import { RT } from '@lesnoypudge/types-utils-react/namespace';



type List<_Value> = (
    RT.PropsWithRenderFunctionOrNode<[
        item: _Value, 
        index: number, 
        array: _Value[]
    ]> & (
        {
            list: _Value[];
            count?: never;
        } | {
            list?: never;
            count: number;
        }
    )
)

export const List = <_Value,>({
    list,
    count,
    children,
}: List<_Value>) => {
    const countListRef = useRef(Array(count).fill(''));

    if (!list) {
        return countListRef.current.map((...args) => (
            <Fragment key={args[1]}>
                {renderFunction(children, ...args)}
            </Fragment>
        ))
    }

    if (!list.length) return null;

    const withId = isObjectWithId(list[0]);

    return list.map((item, index, array) => {
        return (
            <Fragment key={withId ? (item as ObjectWithId).id : index}>
                {renderFunction(children, item, index, array)}
            </Fragment>
        );
    });
};