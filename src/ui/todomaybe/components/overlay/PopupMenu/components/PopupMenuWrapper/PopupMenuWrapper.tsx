import { FC } from "react";
import { OverlayContext, Popup } from "@components";
import { ContextConsumer, renderFunction } from "@lesnoypudge/utils-react";
import { T } from "@lesnoypudge/types-utils-base/namespace";
import { RT } from "@lesnoypudge/types-utils-react/namespace";
import { ScrollableV2 } from "src/dev/WIP/ScrollableV2";
import { cn } from "@utils";



type ChildrenProps = T.Simplify<OverlayContext>;

export type PopupMenuWrapper = (
    Required<Pick<
        Parameters<typeof Popup>[0], 
        'leaderElementOrRectRef'
        | 'label'
    >> 
    & RT.PropsWithRenderFunctionOrNode<[ChildrenProps]>
    & RT.PropsWithClassName
);

const styles = {
    wrapper: `flex flex-col py-1.5 min-w-[calc(min(100dvw,190px))] 
    max-w-[320px] max-h-[80dvh] rounded-md bg-primary-600`,
}

export const PopupMenuWrapper: FC<PopupMenuWrapper> = ({
    className = '',
    leaderElementOrRectRef,
    label,
    children,
}) => {
    return (
        <Popup
            leaderElementOrRectRef={leaderElementOrRectRef}
            preferredAlignment="right"
            blockable
            blocking
            closeOnClickOutside
            closeOnEscape
            focused
            role="menu"
            swappableAlignment
            label={label}
        >
            <ScrollableV2
                className={cn(styles.wrapper, className)}
                size="small"
                withOppositeGutter
                direction="vertical"
            >
                <ContextConsumer context={OverlayContext}>
                    {(value) => renderFunction(children, value)}
                </ContextConsumer>
            </ScrollableV2>
        </Popup>
    )
}