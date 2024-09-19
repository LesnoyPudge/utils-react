import { FC } from "react";
import { Separator } from "@components";
import { RT } from "@lesnoypudge/types-utils-react/namespace";
import { cn } from "@utils";



const styles = {
    separator: 'w-full',
}

export const PopupMenuSeparator: FC<RT.PropsWithClassName> = ({
    className = '',
}) => {
    return (
        <Separator
            className={cn(styles.separator, className)}
            orientation='horizontal'
            thickness={1}
            spacing={4}
        />
    )
}