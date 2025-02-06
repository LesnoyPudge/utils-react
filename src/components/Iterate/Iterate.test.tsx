import { page } from '@vitest/browser/context';
import { Iterate } from './Iterate';



describe('Iterate', () => {
    it('should render provided items as render prop', () => {
        const items = [1, 2, 3];

        const screen = page.render((
            <div data-testid='wrapper'>
                <Iterate items={items}>
                    {(item) => {
                        return (
                            <div key={item}>{item}</div>
                        );
                    }}
                </Iterate>
            </div>
        ));

        const wrapper = screen.getByTestId('wrapper');

        expect(wrapper.element().childElementCount).toBe(items.length);
    });
});