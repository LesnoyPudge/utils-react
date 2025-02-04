import { isSSR } from './isSSR';



describe('isSSR', () => {
    it('should return false in browser environment', () => {
        expect(isSSR()).toBe(false);
    });
});