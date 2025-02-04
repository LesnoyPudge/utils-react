import { isRef } from './isRef';



describe('isRef', () => {
    it('should check if object contain `current` property', () => {
        expect(isRef({})).toBe(false);
        expect(isRef({ current: null })).toBe(true);
    });
});