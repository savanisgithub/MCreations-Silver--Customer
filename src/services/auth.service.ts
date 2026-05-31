import type { ApiResponse } from '../types/api.types';
import type { AuthResponseData, AuthUser, ForgotPasswordPayload, LoginPayload, ResetPasswordPayload, SignupPayload, UpdateProfilePayload } from '../types/auth.types';
import { api } from './api';

export const authService = {
    async login(payload: LoginPayload): Promise<AuthResponseData> {
        const response = await api.post<ApiResponse<AuthResponseData>>(
            '/auth/signin',
            payload,
        );

        return response.data.data;
    },

    async signup(payload: SignupPayload): Promise<AuthResponseData> {
        const response = await api.post<ApiResponse<AuthResponseData>>(
            '/auth/signup',
            payload,
        );

        return response.data.data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/signout');
    },

    async getProfile(): Promise<AuthUser> {
        const response = await api.get<ApiResponse<AuthUser>>('/auth/profile');
        return response.data.data;
    },

    async updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
        const response = await api.patch<ApiResponse<AuthUser>>(
            '/auth/profile',
            payload,
        );

        return response.data.data;
    },

    async forgotPassword(payload: ForgotPasswordPayload): Promise<{
        message: string;
        otp?: string;
        expires_in_minutes?: number;
    }> {
        const response = await api.post<
            ApiResponse<{
                message: string;
                otp?: string;
                expires_in_minutes?: number;
            }>
        >('/auth/forgot-password', payload);

        return response.data.data;
    },

    async resetPassword(payload: ResetPasswordPayload): Promise<void> {
        await api.post('/auth/reset-password', payload);
    },
};