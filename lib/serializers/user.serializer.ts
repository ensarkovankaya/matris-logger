
/**
 * Removes sensitive user information from user object.
 * @param value
 */
export const userSerializer = (value: any) => {
    if ('password' in value) {
        return {...value, password: undefined};
    }
};
