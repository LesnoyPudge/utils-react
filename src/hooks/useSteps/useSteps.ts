import { useFunction } from '@hooks/useFunction';
import { useMemoShallow } from '@hooks/useMemoShallow';
import { T } from '@lesnoypudge/types-utils-base/namespace';
import { useState } from 'react';



export namespace useSteps {
    export type Steps = T.NonEmptyArray<string>;

    export type OnStepAttempt<
        _Steps extends Steps,
    > = (props: {
        step: T.ArrayValues<_Steps>;
        prevent: VoidFunction;
    }) => void;

    export type OnStep<
        _Steps extends Steps,
    > = (props: { step: T.ArrayValues<_Steps> }) => void;

    export type Props<
        _Steps extends Steps,
    > = {
        steps: T.Narrow<_Steps>;
        initialStep?: T.ArrayValues<_Steps>;
        onStep?: OnStep<_Steps>;
        onStepAttempt?: OnStepAttempt<_Steps>;
    };
}

export const useSteps = <
    _Steps extends useSteps.Steps,
>({
    steps,
    initialStep = steps[0],
    onStep,
    onStepAttempt,
}: useSteps.Props<_Steps>) => {
    const maxIndex = steps.length - 1;

    const [
        currentStep,
        setCurrentStep,
    ] = useState(initialStep);

    const makeStep = useFunction((step: T.ArrayValues<_Steps>) => {
        let bail = false;

        const prevent = () => {
            bail = true;
        };

        onStepAttempt?.({
            step,
            prevent,
        });

        if (bail) return;

        onStep?.({ step });
        setCurrentStep(step);
    });

    const getCurrentIndex = useFunction(() => {
        const index = steps.findIndex((step) => step === currentStep);
        return index === -1 ? null : index;
    });

    const stepNext = useFunction(() => {
        const index = getCurrentIndex();
        const nextIndex = index === null ? 0 : Math.max(maxIndex, index + 1);

        makeStep(steps[nextIndex]!);
    });

    const stepPrev = useFunction(() => {
        const index = getCurrentIndex();
        const prevIndex = index === null ? 0 : Math.min(0, index - 1);

        makeStep(steps[prevIndex]!);
    });

    const stepNextLoop = useFunction(() => {
        const index = getCurrentIndex();
        const nextIndex = index === null ? 0 : (index + 1) % steps.length;

        makeStep(steps[nextIndex]!);
    });

    const stepPrevLoop = useFunction(() => {
        const index = getCurrentIndex();
        const prevIndex = (
            index === null
                ? 0
                : (index - 1 + steps.length) % steps.length
        );

        makeStep(steps[prevIndex]!);
    });

    const stepStart = useFunction(() => {
        makeStep(steps[0]!);
    });

    const stepEnd = useFunction(() => {
        const index = Math.max(steps.length - 1, 0);
        makeStep(steps[index]!);
    });

    const stepTo = useMemoShallow((
        Object.keys(steps) as T.ArrayValues<_Steps>[]
    ).reduce<
        Record<T.ArrayValues<_Steps>, VoidFunction>
    >((acc, cur) => {
        acc[cur] = () => makeStep(cur);
        return acc;
    }, {}));

    return {
        currentStep,
        stepNext,
        stepPrev,
        stepNextLoop,
        stepPrevLoop,
        stepStart,
        stepEnd,
        stepTo,
    };
};