export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  trace_id: string;
}

export interface PaginatedResponse<T> {
  code: number;
  message: string;
  data: T[];
  meta: {
    total: number;
    offset: number;
    limit: number;
    has_more: boolean;
  };
  trace_id: string;
}

export interface ApiError {
  code: number;
  message: string;
  trace_id: string;
}
