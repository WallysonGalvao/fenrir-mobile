/**
 * @constant {RegExp} passwordRegex
 * @description
 * Regular expression to validate strong passwords.
 *
 * Password requirements:
 * - At least one uppercase letter (A–Z)
 * - At least one lowercase letter (a–z)
 * - At least one numeric digit (0–9)
 * - At least one special character from: # ? ! @ $ % ^ & * -
 * - Minimum length of 6 characters
 *
 * @example
 * passwordRegex.test('Abc123#'); // true
 * passwordRegex.test('abc123'); // false (missing uppercase and special character)
 * passwordRegex.test('Ab1');    // false (less than 6 characters)
 */
export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
