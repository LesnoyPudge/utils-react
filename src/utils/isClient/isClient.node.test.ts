import { isClient } from './isClient';



describe('isClient', () => {
    it('should return false in non-browser environment', () => {
        expect(isClient()).toBe(false);
    });
});