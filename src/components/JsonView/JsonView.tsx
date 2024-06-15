import { FC, memo, useMemo } from 'react';
import { createJsonView } from '@lesnoypudge/utils';
import { PropsWithClassName } from '@lesnoypudge/types-utils-react';
import { T } from '@lesnoypudge/types-utils-base';


type JsonView = PropsWithClassName & {
    data: string | T.AnyRecord<unknown>;
};

export const JsonView: FC<JsonView> = ({
    className = '',
    data,
}) => {
    const view = useMemo(() => {
        return createJsonView(data, {
            asHTML: false,
            space: 4,
        });
    }, [data]);

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{
                    __html: view ?? '',
            }}
        >
        </div>
    );
};