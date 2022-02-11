/**
 * Check if the given value is null or undefined
 * @param val value
 */
export const isNil = (val: any): val is null | undefined => {
  return val === null || val === undefined;
};

/**
 * Check if the given value is a number (including NaN and +/-Infinity)
 * @param val value
 */
export const isNumber = (val: any): val is number => {
  return typeof val === 'number' || (typeof val === 'object' && val !== null && Object.prototype.toString.call(val) === '[object Number]');
};

/**
 * Check if the given value is a Date
 * @param val value
 */
export const isDate = (val: any): val is Date => {
  return typeof val === 'object' && val !== null && Object.prototype.toString.call(val) === '[object Date]';
};

/**
 * Check if the given value is an array
 * @param val value
 */
export const isArray = (val: any): boolean => {
  return !isNil(val) && typeof val !== 'function' && typeof val !== 'string' && isNumber(val.length) && val.length >= 0 && val.length < Number.MAX_SAFE_INTEGER;
};

/**
 * Returns the input string with the 1st letter of each word capitalized
 * @param str input string
 */
export const ucFirst = (str: string): string => {
  return typeof str === 'string'
    ? str
        .split(' ')
        .map(ch => {
          return ch.charAt(0).toUpperCase() + ch.substring(1);
        })
        .join(' ')
    : str;
};

interface IUtilsObject {
  [prop: string]: (...args: any[]) => any;
}

const AppUtils: IUtilsObject = {
  isNil,
  isNumber,
  isDate,
  isArray,
  ucFirst,
};

export default AppUtils;
