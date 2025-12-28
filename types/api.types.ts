export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: ValidationError[];
    timestamp: string;
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}