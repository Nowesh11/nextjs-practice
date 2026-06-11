import {formatPrice, isValidEmail, truncateText} from './helpers';

describe('formatPrice', () => {
    test('converts cents to dollar string', () =>{
        expect(formatPrice(999)).toBe('$9.99');
    });

    test('handles zero', () => {
        expect(formatPrice(0)).toBe('$0.00');
    });

    test('handles negative', () => {
        expect(formatPrice(-100)).toBe('$-1.00');
    });

    test('handles non-number', () => {
        expect(formatPrice(NaN)).toBe('$0.00');
    });
});

describe('isValidEmail', () => {
    test('returns true for valid email', () =>{
        expect(isValidEmail('ali@gmail.com')).toBe(true);
    });

    test('return false for invalid email', () =>{
        expect(isValidEmail('aliemail')).toBe(false);
    });

    test('returns false for empty string', () => {
        expect(isValidEmail('')).toBe(false);
    });


});

describe('truncateText', () => {    
    test('truncates text', () => {
        expect(truncateText('hello world', 5)).toBe('hello...');
    });

    test('truncates text longer than max length', () => {
        expect(truncateText('hello world', 15)).toBe('hello world');
    });

    test('returns empty string for empty text', () => {
        expect(truncateText('', 5)).toBe('');
    });

    test('text exactly to maxlength', () => {
        expect(truncateText('hello world', 11)).toBe('hello world');
    });
    
});