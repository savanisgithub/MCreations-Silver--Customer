export type UserRole = 'ADMIN' | 'CUSTOMER';
export type Status = 'ACTIVE' | 'INACTIVE';

export interface AuthUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: UserRole;
    status: Status;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface AuthResponseData {
    user: AuthUser;
    access_token: string;
    refresh_token: string;
}

export interface UpdateProfilePayload {
    first_name: string;
    last_name: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    email: string;
    otp: string;
    new_password: string;
}