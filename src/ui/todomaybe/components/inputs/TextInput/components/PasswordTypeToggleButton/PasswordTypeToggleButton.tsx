import { FC, useEffect, useRef } from 'react';
import { Button,SpriteImage } from '@components';
import { PropsWithClassName } from '@types';
import { conditional, twClassNames } from '@utils';
import { IMAGES } from '@generated';



type TepeState = 'password' | 'text'

interface PasswordTypeToggleButton extends PropsWithClassName {
    type: TepeState;
    onToggle: () => void;
}

const styles = {
    button: 'h-10 aspect-square p-2 rounded fill-icon-300 hover:fill-icon-100 focus-visible:fill-icon-100',
    icon: 'h-full w-full',
};

export const PasswordTypeToggleButton: FC<PasswordTypeToggleButton> = ({
    className = '',
    type,
    onToggle,
}) => {
    const initialType = useRef<TepeState>();
    const isPassword = type === 'password';
    const iconId = isPassword ? IMAGES.SPRITE.PASSWORD_EYE_ON.NAME : IMAGES.SPRITE.PASSWORD_EYE_OFF.NAME;
    const isPressed = initialType.current && initialType.current !== type;
    const label = conditional(
        'Показать пароль',
        'Скрыть пароль',
        type === 'password',
    );

    useEffect(() => {
        if (initialType.current) return;

        initialType.current = type;
    }, [type]);

    return (
        <Button
            className={twClassNames(styles.button, className)}
            isActive={isPressed}
            label={label}
            onLeftClick={onToggle}
        >
            <SpriteImage
                className={styles.icon}
                name={iconId}
            />
        </Button>
    );
};