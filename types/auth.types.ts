//types/auth.types.ts
export interface User {
    id: number;
    phoneNumber: string;
    fullName: string;
    email: string | null;
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    lastLoginAt: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string | null;
    user: User;
    newUser: boolean;
}

export interface AuthState {
    user: User | null;
    token: string;
    refreshToken: string | null;
    isLoggedIn: boolean;
    tokenType: string;
    loading: boolean;
    error: string | null;
}
