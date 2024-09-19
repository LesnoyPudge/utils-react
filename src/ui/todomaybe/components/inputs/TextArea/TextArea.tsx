import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



interface TextArea extends PropsWithClassName {
    value: string;
    id?: string;
    placeholder?: string;
    maxLength?: number;
    rows?: number;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const styles = {
    wrapper: 'relative rounded bg-primary-500 text-color-base text-base overflow-hidden',
    textarea: 'block w-full overflow-y-scroll p-2.5 pr-7',
    srHint: 'sr-only',
    symbolsLeft: 'absolute right-4 bottom-2 pointer-events-none text-color-muted text-xs',
};

export const TextArea: FC<TextArea> = ({
    className = '',
    value,
    id,
    placeholder = '',
    maxLength = 128,
    rows = 6,
    onChange,
}) => {
    const symbolsLeft = maxLength - value.length;

    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <textarea
                className={styles.textarea}
                id={id}
                value={value}
                rows={rows}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={onChange}
            />

            <div className={styles.srHint}>
                <>Максимум символов: {maxLength}</>
            </div>

            <div 
                className={styles.symbolsLeft}
                aria-hidden={true}
            >
                {symbolsLeft}
            </div>
        </div>
    );
};