import { FC, useEffect, useState } from 'react';
import { PropsWithClassName } from '@types';
import { PartialFormatter } from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { NoUiSlider } from '@libs';



interface SliderInput extends PropsWithClassName {
    // name: string;
    start: number;
    range: number[];
    format?: PartialFormatter;
}

export const SliderInput: FC<SliderInput> = ({
    className = '',
    // name,
    start,
    range,
    format,
}) => {
    const [state, setState] = useState(start ? start : range[0]);

    useEffect(() => {
        console.log('state update:', state);
    }, [state]);

    return (
        <NoUiSlider
            className={className}
            range={range}
            start={state}
            onUpdate={setState}
            format={format}
        />
    );
};