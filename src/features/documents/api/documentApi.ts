import { httpClient } from '@/infrastructure/http/client';
import * as mockApi from '@/infrastructure/mock/mockApi';
import type { ApiResponse, PaginatedResponse } from '@/infrastructure/http/types';
import type { Document, DocumentFilters } from './documentTypes';

// Use mock in development when no backend is available
const USE_MOCK = import.meta.env.DEV;

export const documentApi = {
  getDocuments: async (filters: DocumentFilters = {}): Promise<PaginatedResponse<Document>> => {
    if (USE_MOCK) {
      return mockApi.getDocuments(filters.search);
    }
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.offset) params.set('offset', String(filters.offset));
    return httpClient.get(`/documents?${params.toString()}`);
  },

  getDocument: async (id: string): Promise<ApiResponse<Document>> => {
    if (USE_MOCK) {
      return mockApi.getDocument(id);
    }
    return httpClient.get(`/documents/${id}`);
  },

  uploadDocument: async (file: File): Promise<ApiResponse<Document>> => {
    if (USE_MOCK) {
      return mockApi.uploadDocument(file);
    }
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteDocument: async (id: string): Promise<ApiResponse<null>> => {
    if (USE_MOCK) {
      return mockApi.deleteDocument(id);
    }
    return httpClient.delete(`/documents/${id}`);
  },
};
