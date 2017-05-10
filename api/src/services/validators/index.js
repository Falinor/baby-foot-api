/**
 * Checks whether an array's length is greater than a given minimum value.
 * @param {number} minLength - The minimum length wanted.
 * @return {boolean} True if the array contains more elements than the minimum
 * allowed. False otherwise.
 */
export const minArrayLengthValidator = (minLength) => async (v) =>
  v.length >= minLength;

/**
 * Checks whether an array's length is lesser than a given maximum value.
 * @param {number} maxLength - The maximum length wanted.
 * @return {boolean} True if the array contains less elements than the maximum
 * allowed. False otherwise.
 */
export const maxArrayLengthValidator = (maxLength) => async (v) =>
  v.length <= maxLength;
