import { mutate } from './mutate';



describe('mutate', () => {
    it('should mutate object', () => {
        const obj = { value: 0 };

        expect(mutate(obj, 'value', 5)).toEqual({ value: 5 });
    });
});