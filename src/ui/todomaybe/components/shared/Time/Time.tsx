import { PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { formatRelative, lightFormat, toDate } from 'date-fns';
import { ru } from 'date-fns/locale';
import { FC } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';



type DateFormatType = 'dd.MM.yyyy HH:mm:ss' | 'HH:mm:ss' | 'dd.MM.yyyy' | 'HH:mm';

interface ChildrenArgs {
    formattedTime: string;
}

interface Time extends PropsWithClassName, PropsWithChildrenAsNodeOrFunction<ChildrenArgs> {
    id?: string;
    date: number | string | Date;
    format?: DateFormatType;
    customFormat?: string;
}

export const Time: FC<Time> = ({
    className = '',
    id,
    date,
    format = 'dd.MM.yyyy HH:mm:ss',
    customFormat = '',
    children,
}) => {
    date = date ? date : Date.now();

    const parsedDate = toDate(typeof date === 'string' ? parseInt(date) : date);
    const chosenFormat = customFormat ? customFormat : format;
    const label = formatRelative(parsedDate, Date.now(), { locale: ru });
    const dateTime = parsedDate.toLocaleString();
    
    const childrenArgs: ChildrenArgs = {
        formattedTime: lightFormat(parsedDate, chosenFormat),
    };

    return (
        <time
            className={className}
            id={id}
            aria-label={label}
            dateTime={dateTime}
        >
            <ChildrenAsNodeOrFunction args={childrenArgs}>
                {children}
            </ChildrenAsNodeOrFunction>
        </time>
    );
};