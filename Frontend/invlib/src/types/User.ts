export interface User {
    id: number;
    email: string;
    fullName: string;
    roles: string[];
}

export interface UserAuthResponse {
    user?: User;
    response: Response;
}

export interface UserSignupResponse {
    user?: User;
    response: Response;
}