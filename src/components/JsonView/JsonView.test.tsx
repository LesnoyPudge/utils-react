import { page } from '@vitest/browser/context';
import { JsonView } from './JsonView';



describe('JsonView', () => {
    it('should render to screen', () => {
        const screen = page.render((
            <JsonView
                className='test'
                data={JSON.stringify({})}
            />
        ));

        const element = screen.container.querySelector('.test');

        expect(element).toBeInTheDocument();
    });
});