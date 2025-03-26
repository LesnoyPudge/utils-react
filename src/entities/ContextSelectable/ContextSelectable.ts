import * as c1 from './components';
import * as c2 from './hooks';
import * as c3 from './utils';



export namespace ContextSelectable {
    export import ConsumerProxy = c1.ContextConsumerProxy;

    export import ConsumerSelector = c1.ContextConsumerSelector;

    export import useProxy = c2.useContextProxy;

    export import useSelector = c2.useContextSelector;

    export import createConsumerProxy = c3.createContextConsumerProxy;

    export import createContext = c3.createContextSelectable;
}