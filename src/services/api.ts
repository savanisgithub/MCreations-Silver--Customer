import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

const ACCESS_TOKEN_KEY = 'customer_access_token';
const REFRESH_TOKEN_KEY = 'customer_refresh_token';
const USER_KEY = 'customer_user';

interface RetryRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 20000,
});

const refreshApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 20000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<any>) => {
        const originalRequest = error.config as RetryRequestConfig | undefined;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

            if (!refreshToken) {
                clearCustomerSession();
                return Promise.reject(formatAxiosError(error));
            }

            try {
                const refreshResponse = await refreshApi.post('/auth/refresh-token', {
                    refresh_token: refreshToken,
                });

                const newAccessToken = refreshResponse.data.data.access_token;
                const newRefreshToken = refreshResponse.data.data.refresh_token;

                localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
                localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                clearCustomerSession();
                window.location.href = '/login';

                return Promise.reject(formatAxiosError(refreshError as AxiosError<any>));
            }
        }

        return Promise.reject(formatAxiosError(error));
    },
);

function clearCustomerSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

function formatAxiosError(error: AxiosError<any>) {
    const rawMessage =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong';

    const message = Array.isArray(rawMessage)
        ? rawMessage.join(', ')
        : rawMessage;

    return {
        status: error.response?.status,
        message,
        original: error,
    };
}