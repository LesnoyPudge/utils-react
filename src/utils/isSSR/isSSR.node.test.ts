import { isSSR } from './isSSR';



describe('isSSR', () => {
    it('should return true in server-side environment', () => {
        expect(isSSR()).toBe(true);
    });
});