import {
    createContext,

    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { authService } from '../services/auth.service';
import type { AuthUser, LoginPayload, SignupPayload } from '../types/auth.types';


interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    signup: (payload: SignupPayload) => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    updateLocalUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'customer_access_token';
const REFRESH_TOKEN_KEY = 'customer_refresh_token';
const USER_KEY = 'customer_user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem(USER_KEY);
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

        if (savedUser && accessToken) {
            setUser(JSON.parse(savedUser));
        }

        setIsLoading(false);
    }, []);

    async function login(payload: LoginPayload) {
        const data = await authService.login(payload);

        if (data.user.role !== 'CUSTOMER') {
            throw new Error('Only customer accounts can access the customer site');
        }

        localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        setUser(data.user);
    }

    async function signup(payload: SignupPayload) {
        const data = await authService.signup(payload);

        if (data.user.role !== 'CUSTOMER') {
            throw new Error('Only customer accounts can access the customer site');
        }

        localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        setUser(data.user);
    }

    async function refreshProfile() {
        const profile = await authService.getProfile();
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
        setUser(profile);
    }

    function updateLocalUser(updatedUser: AuthUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
    }

    async function logout() {
        try {
            await authService.logout();
        } catch {
            // Clear local session even if backend logout fails.
        }

        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        setUser(null);
    }

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: Boolean(user),
            isLoading,
            login,
            signup,
            logout,
            refreshProfile,
            updateLocalUser,
        }),
        [user, isLoading],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
}