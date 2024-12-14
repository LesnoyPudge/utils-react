import * as c1 from './components';
import * as c2 from './context';



export namespace MoveFocus {
    export import At = c1.MoveFocusAt;

    export import Inside = c1.MoveFocusInside;

    export import Context = c2.FocusContext;

    export const {
        useMoveFocusAt,
        useMoveFocusInside,
    } = c1;
}