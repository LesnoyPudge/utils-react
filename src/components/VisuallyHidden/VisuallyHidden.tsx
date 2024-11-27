import { ComponentProps, CSSProperties, FC } from 'react';



const styles: CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
};

export namespace VisuallyHidden {
    export type Props = ComponentProps<'div'>;
}

export const VisuallyHidden: FC<VisuallyHidden.Props> = ({
    children,
    style: _style,
    ...rest
}) => {
    const style = _style ? { ...styles, ..._style } : styles;

    return (
        <div style={style} {...rest}>
            {children}
        </div>
    );
};