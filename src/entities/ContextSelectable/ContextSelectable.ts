import * as components from './components';
import * as hooks from './hooks';
import * as utils from './utils';



export namespace ContextSelectable {
    export import ConsumerProxy = components.ContextConsumerProxy;

    export import ConsumerSelector = components.ContextConsumerSelector;

    export import useProxy = hooks.useContextProxy;

    export import useSelector = hooks.useContextSelector;

    export import createConsumerProxy = utils.createContextConsumerProxy;

    export import createContext = utils.createContextSelectable;

    export import createUseProxyHook = utils.createUseContextProxyHook;

    export import createUseSelectorHook = utils.createUseContextSelectorHook;

    export import createContextWithHooks = utils.createContextSelectableWithHooks;
}