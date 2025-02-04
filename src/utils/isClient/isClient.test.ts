import { isClient } from './isClient';



describe('isClient', () => {
    it('should return true in browser environment', () => {
        expect(isClient()).toBe(true);
    });
});