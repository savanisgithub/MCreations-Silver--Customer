export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedApiResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}