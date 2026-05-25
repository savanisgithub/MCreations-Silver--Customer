import type { ApiResponse } from '../types/api.types';
import type { AuthResponseData, LoginPayload, SignupPayload } from '../types/auth.types';
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
};