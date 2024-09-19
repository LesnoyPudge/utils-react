import { T } from '@lesnoypudge/types-utils-base';
import {
    ListenerStore, ListenerStoreCallback,
    autoBind, inRange, pick, shallowEqual,
    getId,
} from '@lesnoypudge/utils';
import {
    FC, MutableRefObject, RefObject, createContext,
    useEffect, useLayoutEffect, useMemo,
    useRef, useState, useSyncExternalStore,
} from 'react';
import {
    ContextSelectable, ContextSelectableSelector,
    createContextSelectable, createContextSelectableConsumer,
    useContextSelectable, useConst,
    defaultSelector,
    useForceUpdate,
} from '@root';


// const MyForm = new Form<MyFormValues>({
//     // initial: {}
//     // validator
// });

// const MyFormContext = createContext();

// const MyFormContextProvider = createFormContextProvider('MyForm', MyFormContext);



type ValidationResult<_Form extends T.UnknownRecord> = {
    success: boolean;
    message: string;
    fields?: {
        [_Key in keyof _Form]: {
            success: boolean;
            message: string;
            value: _Form[_Key];
        }
    };
};


type Validator<_FormShape extends T.UnknownRecord> = (
    shape: _FormShape,
) => Promise<ValidationResult<_FormShape>>;



// type Field<_Value> = {
//     value: _Value;
// };

// type Fields<_FormShape extends T.UnknownRecord> = {
//     [_Key in keyof _FormShape]: Field<_FormShape[_Key]>;
// };

class Field<_Value, _Name> {
    name;
    value;
    initialValue;
    listenerStore: ListenerStore<null, [_Value, Field<_Value, _Name>]>;

    constructor(value: _Value, name: _Name) {
        this.name = name;
        this.value = value;
        this.initialValue = value;
        this.listenerStore = new ListenerStore();

        autoBind(this);
    }

    subscribe(cb: T.AnyFunction<[_Value, Field<_Value, _Name>], void>) {
        this.listenerStore.add(null, cb);

        return () => this.listenerStore.remove(null, cb);
    }

    onChange(value: _Value) {
        this.value = value;
        this.listenerStore.trigger(null, value, this);
    }

    reset(value: _Value) {
        this.value = value;
    }
}

type Fields<_FormsShape extends T.UnknownRecord> = {
    [_Key in keyof _FormsShape]: Field<_FormsShape[_Key], _Key>;
};
// & {
//     reset: (initialValue: _FormsShape) => void;
// };

const createFields = <_FormShape extends T.UnknownRecord>(
    initialValues: _FormShape,
): Fields<_FormShape> => {
    const keys = Object.keys(initialValues) as [keyof _FormShape];

    return keys.reduce<Fields<_FormShape>>((acc, key) => {
        acc[key] = new Field(initialValues[key], key);
        return acc;
    }, {});
};

type FormProps<
    _FormShape extends T.UnknownRecord,
    _ExternalFormError = null,
> = {
    getInitialValues: () => _FormShape;
    onSubmit: T.AnyFunction<[_FormShape, Form<_FormShape, _ExternalFormError>]>;
    // onSuccess: AnyFunction<[_FormShape, Form<_FormShape>]>;
    validator?: Validator<_FormShape>;
    externalFormError?: _ExternalFormError;
};

const defaultValidator: Validator<T.AnyRecord> = () => {
    return Promise.resolve({
        success: true,
        message: 'empty',
    });
};

type Form<
    _FormShape extends T.UnknownRecord,
    _ExternalFormError = null,
> = FormImpl<_FormShape, _ExternalFormError>;

class FormImpl<
    _FormShape extends T.UnknownRecord,
    _ExternalFormError,
> {
    initialValues;
    getInitialValues;
    fields;
    validator;
    listenerStore: ListenerStore<null, [
        _FormShape, Form<_FormShape, _ExternalFormError>,
    ]>;
    onSubmit;
    isValidationError;
    validationResult: null | ValidationResult<_FormShape>;
    isSubmitting;
    externalFormError;

    constructor(props: FormProps<_FormShape, _ExternalFormError>) {
        this.getInitialValues = props.getInitialValues;
        this.initialValues = this.getInitialValues();
        this.fields = createFields(this.initialValues);
        this.validator = props.validator ?? defaultValidator;
        this.listenerStore = new ListenerStore();
        this.onSubmit = props.onSubmit;
        this.isValidationError = false;
        this.validationResult = null;
        this.isSubmitting = false;
        this.externalFormError = props.externalFormError;

        const onFieldChange = () => {
            this.listenerStore.trigger(null, this.getShape(), this);
        };

        Object.keys(this.fields).forEach((key) => {
            this.fields[key].subscribe(onFieldChange);
        });

        autoBind(this);
    }

    updateProps(newProps: FormProps<_FormShape, _ExternalFormError>) {
        this.getInitialValues = newProps.getInitialValues;
        this.initialValues = this.getInitialValues();
        // this.fields = createFields(this.initialValues);
        this.validator = newProps.validator ?? defaultValidator;
        // this.listenerStore = new ListenerStore();
        this.onSubmit = newProps.onSubmit;
        // this.isValidationError = false;
        // this.validationError = null;
        // this.isSubmitting = false;
        this.externalFormError = newProps.externalFormError;

        this.listenerStore.trigger(null, this.getShape(), this);
    }

    onChange(
        cb: ListenerStoreCallback<
            [_FormShape, Form<_FormShape, _ExternalFormError>]
        >,
    ) {
        this.listenerStore.add(null, cb);

        return () => this.listenerStore.remove(null, cb);
    }

    reset(initialValues?: _FormShape) {
        const _initialValues = initialValues ?? this.getInitialValues();
        const keys = Object.keys(this.fields) as [keyof _FormShape];

        keys.forEach((key) => {
            this.fields[key].reset(_initialValues[key]);
        });
    }

    getShape() {
        const keys = Object.keys(this.fields) as [keyof _FormShape];

        return keys.reduce<_FormShape>((acc, cur) => {
            acc[cur] = this.fields[cur].value;
            return acc;
        }, {});
    }

    async validate(shape: _FormShape) {
        const result = await this.validator(shape);
        // change form state, if listener is unblocked trigger listeners
        this.isValidationError = !result.success;
        this.validationResult = result;

        return result;
    }

    async submit() {
        const shape = this.getShape();
        const result = await this.validate(shape);
        if (!result.success) return;

        await this.onSubmit(shape, this);
    }
}

import deepEqual from 'fast-deep-equal';
import createClone from 'rfdc';

const deepClone = createClone({ circles: true, proto: true });

export const useCreateForm = <
    _FormShape extends T.UnknownRecord,
    _ExternalFormError = null,
>(
    props: FormProps<_FormShape, _ExternalFormError>,
): Form<_FormShape, _ExternalFormError> => {
    const mutableForm = useConst(() => new FormImpl(props));
    const prevPropsRef = useRef(props);
    const versionRef = useRef(0);
    const lastSnapshotRef = useRef<
        Form<_FormShape, _ExternalFormError> | null
    >(null);
    const lastReturnRef = useRef<
        Form<_FormShape, _ExternalFormError> | null
    >(null);
    const form = useSyncExternalStore(
        // eslint-disable-next-line @typescript-eslint/unbound-method
        mutableForm.onChange,
        () => {
            if (lastSnapshotRef.current === null) {
                lastSnapshotRef.current = deepClone(mutableForm);
                lastReturnRef.current = { ...mutableForm };
                return lastReturnRef.current;
            }

            const cloned = deepClone(mutableForm);
            if (deepEqual(lastSnapshotRef.current, cloned)) {
                return lastReturnRef.current;
            }

            lastSnapshotRef.current = cloned;
            lastReturnRef.current = { ...mutableForm };

            return lastReturnRef.current;



            // const methods = pick(mutableForm,
            //     'getInitialValues',
            //     'getShape',
            //     'onChange',
            //     'onSubmit',
            //     'reset',
            //     'submit',
            //     'updateProps',
            //     'validate',
            // );

            // const data = {
            //     ...mutableForm,
            //     ...methods,
            // };

            // if (!lastSnapshotRef.current) {
            //     lastSnapshotRef.current = data;
            // }

            // if (deepEqual(
            //     structuredClone(lastSnapshotRef.current),
            //     structuredClone(data),
            // )) return lastSnapshotRef.current;

            // lastSnapshotRef.current = data;

            // return data;
        },
    );


    const { forceUpdate } = useForceUpdate();

    // useEffect(() => {
    //     return mutableForm.onChange(forceUpdate);
    // }, [forceUpdate, mutableForm]);

    useEffect(() => {
        // if (shallowEqual(props, prevPropsRef.current)) return;
        // prevPropsRef.current = props;
        mutableForm.updateProps(props);
    }, [props, mutableForm]);

    // const qwe = { ...mutableForm };

    return form;

    // return Object.keys(mutableForm).reduce((acc, cur) => {
    //     // @ts-ignore
    //     acc[cur] = mutableForm[cur];
    //     return acc;
    // }, {});
};



export const createFormContext = <
    _FormShape extends T.UnknownRecord,
    _ExternalFormError = null,
>() => {
    return createContextSelectable<Form<_FormShape, _ExternalFormError>>();
};

type MyFormValues = {
    some: string;
    count: number;
};

const MyFormContext = createFormContext<MyFormValues>();

const MyFormProvider = MyFormContext.Provider;

const MyFormConsumer = createContextSelectableConsumer(MyFormContext, 'MyForm');

const formKeysToPick: T.NonEmptyArray<keyof Form<T.UnknownRecord>> = [
    'externalFormError',
    'initialValues',
    'isSubmitting',
    'isValidationError',
    'reset',
    'submit',
    'validate',
    'validationResult',
] as const;

export const useForm = <_FormShape extends T.UnknownRecord>(
    formContext: ContextSelectable<Form<_FormShape>>,
    // selector?:
) => {
    return useContextSelectable(formContext, (v) => pick(v, ...formKeysToPick));
};

export const useField = <
    _FormShape extends T.UnknownRecord,
    _FieldName extends keyof Form<_FormShape>['fields'],
    _SelectedValue = Form<_FormShape>['fields'][_FieldName],
>(
    formContext: ContextSelectable<Form<_FormShape>>,
    fieldName: _FieldName,
    selector: ContextSelectableSelector<
        Form<_FormShape>['fields'][_FieldName],
        _SelectedValue
    > = defaultSelector,
) => {
    return useContextSelectable(formContext, (v) => {
        return selector(v.fields[fieldName]);
    });
};

export const Test: FC = () => {
    const form = useCreateForm<MyFormValues>({
        getInitialValues: () => ({ count: 0, some: '' }),
        onSubmit: (values) => {
            // form.fields.count.
            console.log(values);
        },
    });

    const InnerTest: FC = () => {
        const { isSubmitting, fields } = useForm(MyFormContext);

        const initialValue = useField(
            MyFormContext,
            'count',
            (v) => v.initialValue,
        );
        initialValue.toFixed();

        const field = useField(MyFormContext, 'some');
        const { name, value } = field;

        return (
            <>
                <MyFormConsumer>
                    {({ initialValues, fields, isSubmitting }) => (
                        <>
                        </>
                    )}
                </MyFormConsumer>

                <MyFormConsumer selector={(v) => v.initialValues}>
                    {({ count, some }) => (
                        <>
                        </>
                    )}
                </MyFormConsumer>
            </>
        );
    };

    return (
        <>
            <MyFormProvider value={form}>
                <InnerTest/>
            </MyFormProvider>
        </>
    );
};



// const FormProvider = <_Form extends T.UnknownRecord>({
//     form,
//     initialValues,
//     apiRef,
//     resetOnInitialsChange = false,
//     validator,
// }: {
//     form: _Form;
//     initialValues: _Form['fields'];
//     resetOnInitialsChange?: boolean;
//     apiRef?: MutableRefObject<any>;
//     validator?: AnyFunction<[_Form], Promise<ValidationResult<_Form>>>;
// }) => {
//     // const formApiRef = useRef(new Form({
//     //     initialValues,
//     //     resetOn,
//     // }));


//     // useLayoutEffect(() => {
//     //     if (!apiRef) return;

//     //     apiRef.current = formApiRef.current;
//     // }, [apiRef]);

//     return (
//         <>
//         </>
//     );
// };

// export const Test: FC = () => {
//     return (
//         <FormProvider
//             initialValues={{
//                 some: '',
//                 count: 0,
//             }}
//         >
//             <></>
//         </FormProvider>
//     );
// };