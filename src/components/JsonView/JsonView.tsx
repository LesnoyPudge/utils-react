import { FC } from 'react';
import { PropsWithClassName } from '@lesnoypudge/types-utils-react';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import View from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';



type JsonView = PropsWithClassName & {
    data: string | T.UnknownRecord;
};

export const JsonView: FC<JsonView> = ({
    className = '',
    data,
}) => {
    return (
        <View
            className={className}
            data={data}
            space={4}
        />
    );
};