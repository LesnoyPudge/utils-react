import * as c1 from './components';
import * as c2 from './hooks';



export namespace Focus {
    export import Inside = c1.FocusInside;

    export import Lock = c1.FocusLock;

    export import useAutoFocusable = c2.useAutoFocusable;

    export import useMoveFocusInside = c2.useMoveFocusInside;
}