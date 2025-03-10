import * as c from './components';



/**
 * Collection of memoized components with different comparison function.
 */
export namespace Memo {
    export import Deep = c.MemoDeep;

    export import Static = c.MemoStatic;
}