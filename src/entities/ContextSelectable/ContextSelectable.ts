import * as components from './components';
import * as hooks from './hooks';
import * as utils from './utils';



export namespace ContextSelectable {
    export const {
        createContextConsumerProxy: createConsumerProxy,
        createContextSelectable: createContext,
        createContextSelectableWithHooks: createContextWithHooks,
        createUseContextProxyHook: createUseProxyHook,
        createUseContextSelectorHook: createUseSelectorHook,
    } = utils;

    export const {
        ContextConsumerProxy: ConsumerProxy,
        ContextConsumerSelector: ConsumerSelector,
    } = components;

    export const {
        useContextProxy: useProxy,
        useContextSelector: useSelector,
    } = hooks;
}