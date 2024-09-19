import { Button } from '@components';
import { FC } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { useThrottle } from '@hooks';
import { fpsToMs, twClassNames } from '@utils';
import { PropsWithClassName } from '@types';



export interface ColorPicker extends PropsWithClassName {
    color: string;
    colorPresets?: string[];
    onChange: (color: string) => void;
}

const styles = {
    colorPicker: `flex flex-col p-4 gap-4 shrink-0 pointer-events-auto
    bg-primary-200 rounded-md shadow-elevation-high color-picker`,
    colorInput: 'bg-primary-500 rounded p-2.5',
    presetsWrapper: 'flex gap-1 justify-between',
    presetButton: 'w-8 h-8 rounded-md overflow-hidden',
    presetColor: 'w-full h-full',
};

export const ColorPicker: FC<ColorPicker> = ({
    className = '',
    color,
    colorPresets = [],
    onChange,
}) => {
    const { throttle } = useThrottle();
    const handleChange = throttle(onChange, fpsToMs(60));

    const withColorPresets = !!colorPresets?.length;

    return (
        <div className={twClassNames(styles.colorPicker, className)}>
            <HexColorPicker 
                color={color} 
                onChange={handleChange}
            />

            <HexColorInput 
                className={styles.colorInput}
                color={color}
                prefix='#'
                prefixed
                onChange={handleChange}
            />

            <If condition={withColorPresets}>
                <div className={styles.presetsWrapper}>
                    {colorPresets.map((color) => (
                        <Button 
                            className={styles.presetButton}
                            onLeftClick={() => onChange(color)}   
                            key={color}
                        >
                            <div 
                                className={styles.presetColor}
                                style={{ backgroundColor: color }}
                            ></div>
                        </Button>
                    ))}
                </div>
            </If>
        </div>
    );
};