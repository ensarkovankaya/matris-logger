
/**
 * Removes sensitive user information from user object.
 * @param value
 */
export const userSerializer = (value: any): any => {
    if (typeof value === 'object' && 'password' in value) {
        return {...value, password: undefined};
    }
    return value;
};
