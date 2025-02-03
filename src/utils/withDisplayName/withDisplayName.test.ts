/* eslint-disable unicorn/consistent-function-scoping */
import { withDisplayName } from './withDisplayName';



describe('withDisplayName', () => {
    it('should set the displayName of the component', () => {
        const Test = () => null;

        const Wrapped = withDisplayName(
            'Test',
            Test,
        );

        expect(Wrapped.displayName).toBe('Test');
    });
});