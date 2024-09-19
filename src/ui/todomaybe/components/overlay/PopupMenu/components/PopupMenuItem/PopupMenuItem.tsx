import { FC, RefObject } from "react";
import { Button } from "@components";
import { cn } from "@utils";
import { RT } from "@lesnoypudge/types-utils-react/namespace";



type PopupMenuItem = (
    Pick<
        Button, 
        'hasPopup'
        | 'isActive'
        | 'isLoading'
        | 'isDisabled'
        | 'label'
    >
    & RT.PropsWithChildrenAndClassName
    & {
        ref?: RefObject<HTMLButtonElement>;
        onClick?: Pick<Button, 'onLeftClick'>['onLeftClick'],
    }
);

const styles = {
    wrapper: 'flex gap-0.5 truncate w-full justify-between',
}

export const PopupMenuItem: FC<PopupMenuItem> = ({
    className = '',
    ref,
    children,
    onClick,
    ...rest
}) => {
    return (
        <Button
            className={cn(styles.wrapper, className)}
            role="menuitem"
            size="small"
            stylingPreset="invisibleBrand"
            innerRef={ref}
            onLeftClick={onClick}
            {...rest}
        >
            {children}
        </Button>
    )
}