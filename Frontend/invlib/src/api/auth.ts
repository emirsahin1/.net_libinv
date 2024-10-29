import { User, UserAuthResponse, UserSignupResponse } from "@/types/User";

/**
 * Attempts to authenticate a user.
 * Cookies are automatically handled by the browser
 * @param email 
 * @param password 
 * @returns 
 */
export const login = async (email: string, password: string): Promise<UserAuthResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(6000),
        credentials: 'include',
    },);

    if (!response.ok) {
        return { response: response };
    }
    const user: User = await response.json();
    return { user,  response: response };
};

/**
 * Create a new user in the system.
 * @param fullName 
 * @param email 
 * @param password 
 * @param isLibrarian 
 * @returns 
 */
export const signup = async (fullName: string, email: string, password: string, isLibrarian: boolean): Promise<UserSignupResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fullName, 
            isLibrarian,
            email, 
            password, }),
        signal: AbortSignal.timeout(6000),
        credentials: 'include',
    },);

    if (!response.ok) {
        return { response: response };
    }
    const user: User = await response.json();
    return { user, response: response };
};

export const logout = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(6000),
        credentials: 'include',
    },);
    if (!response.ok) {
        return { response: response };
    }
}

/**
 * Check to see if browser session is authenticated
 * @returns UserLoginResponse
 */
export const checkAuth = async () : Promise<UserAuthResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',

        },
        signal: AbortSignal.timeout(6000),
        credentials: 'include',
    },);
    if (!response.ok) {
        return { response: response };
    }
    const user: User = await response.json();
    return { user, response: response };
}
