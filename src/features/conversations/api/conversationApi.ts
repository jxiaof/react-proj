import { httpClient } from '@/infrastructure/http/client';
import * as mockApi from '@/infrastructure/mock/mockApi';
import type { ApiResponse, PaginatedResponse } from '@/infrastructure/http/types';
import type { Conversation, CreateConversationRequest } from './conversationTypes';

const USE_MOCK = import.meta.env.DEV;

export const conversationApi = {
  getConversations: async (): Promise<PaginatedResponse<Conversation>> => {
    if (USE_MOCK) {
      return mockApi.getConversations();
    }
    return httpClient.get('/conversations');
  },

  getConversation: async (id: string): Promise<ApiResponse<Conversation>> => {
    if (USE_MOCK) {
      return mockApi.getConversation(id);
    }
    return httpClient.get(`/conversations/${id}`);
  },

  createConversation: async (data: CreateConversationRequest): Promise<ApiResponse<Conversation>> => {
    if (USE_MOCK) {
      return mockApi.createConversation(data);
    }
    return httpClient.post('/conversations', data);
  },

  deleteConversation: async (id: string): Promise<ApiResponse<null>> => {
    if (USE_MOCK) {
      return mockApi.deleteConversation(id);
    }
    return httpClient.delete(`/conversations/${id}`);
  },
};
