import { 
    useContextProxy, 
    ContextSelectable 
} from '@entities/ContextSelectable';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { renderFunction } from '@utils/renderFunction';



type ContextConsumerProxyProps<
    _Value extends T.UnknownRecord,
> = (
    RT.PropsWithRenderFunction<[_Value]>
    & {
        context: ContextSelectable<_Value>;
    }
);

export const ContextConsumerProxy = <
    _Value extends T.UnknownRecord,
>({
    context,
    children,
}: ContextConsumerProxyProps<_Value>) => {
    const value = useContextProxy(context);

    return renderFunction(children, value);
};