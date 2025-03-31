import { ComponentType } from 'react';
import { Status } from '../vars';



export namespace Types {
    export namespace withDelay {
        export type Options = {
            delay?: number;
            enable?: boolean;
        };
    }

    export namespace asyncRetry {
        export type Options = {
            maxTriesCount?: number;
            backoffFn?: (count: number) => number;
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type BaseComponent = ComponentType<any>;

    type WithDefault<_Result> = {
        default: _Result;
    };

    type Status = typeof Status;

    export type UninitializedPayload<
        _Component extends Types.BaseComponent,
    > = {
        _status: Status['Uninitialized'];
        _result: PromiseModuleFactory<_Component>;
    };

    export type PendingPayload = {
        _status: Status['Pending'];
        _result: Promise<unknown>;
    };

    export type ResolvedPayload<
        _Component extends Types.BaseComponent,
    > = {
        _status: Status['Resolved'];
        _result: Module<_Component>;
    };

    export type RejectedPayload = {
        _status: Status['Rejected'];
        // pass error from rejected factory
        _result: unknown;
    };

    export type Payload<
        _Components extends Types.BaseComponent,
    > = (
        UninitializedPayload<_Components>
        | PendingPayload
        | ResolvedPayload<_Components>
        | RejectedPayload
    );

    export type PromiseFactory<_Result> = () => Promise<_Result>;

    export type Module<
        _Component extends Types.BaseComponent,
    > = WithDefault<_Component>;

    export type PromiseModule<
        _Component extends Types.BaseComponent,
    > = Promise<WithDefault<_Component>>;

    export type ModuleFactory<
        _Component extends Types.BaseComponent,
    > = () => Module<_Component>;

    export type PromiseModuleFactory<
        _Component extends Types.BaseComponent,
    > = () => PromiseModule<_Component>;

    export type ModuleOrPromiseModuleFactory<
        _Component extends Types.BaseComponent,
    > = (
        ModuleFactory<_Component> | PromiseModuleFactory<_Component>
    );
}