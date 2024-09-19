import { Button,SpriteImage, TextInput, TextInputWrapper } from '@components';
import { IMAGES } from '@generated';
import { conditional, twClassNames } from '@utils';
import { FC, useRef } from 'react';



interface SearchBar {
    className?: string;
    placeholder?: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReset: () => void;
}

const styles = {
    wrapper: 'flex h-10',
    input: 'h-full',
    button: `flex shrink-0 h-full aspect-square rounded fill-icon-300 
    hover:fill-icon-200 focus-visible:fill-icon-200`,
    icon: 'h-2/3 aspect-square shrink-0 m-auto',
};

export const SearchBar: FC<SearchBar> = ({
    className = '',
    placeholder = 'Поиск',
    label,
    value,
    onChange,
    onReset,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (value) return onReset();
        inputRef.current && inputRef.current.focus();
    };

    const iconId = value ? IMAGES.SPRITE.CROSS_ICON.NAME : IMAGES.SPRITE.SEARCH_ICON.NAME;
    const buttonLabel = conditional('Очистить поиск', 'Перейти к поиску', !!value);

    return (
        <TextInputWrapper className={twClassNames(styles.wrapper, className)}>
            <TextInput
                className={styles.input}
                name='search'
                placeholder={placeholder}
                value={value}
                label={label}
                inputRef={inputRef}
                onChange={onChange}
            />

            <Button
                className={styles.button}
                label={buttonLabel}
                onLeftClick={handleClick}
            >
                <SpriteImage
                    className={styles.icon}
                    name={iconId}
                />
            </Button>
        </TextInputWrapper>
    );
};