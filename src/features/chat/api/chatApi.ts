import { httpClient } from '@/infrastructure/http/client';
import * as mockApi from '@/infrastructure/mock/mockApi';
import type { ApiResponse, PaginatedResponse } from '@/infrastructure/http/types';
import type { Message, SendMessageRequest, SendMessageResponse } from './chatTypes';

const USE_MOCK = import.meta.env.DEV;

export const chatApi = {
  getMessages: async (conversationId: string): Promise<PaginatedResponse<Message>> => {
    if (USE_MOCK) {
      return mockApi.getMessages(conversationId);
    }
    return httpClient.get(`/conversations/${conversationId}/messages`);
  },

  sendMessage: async (data: SendMessageRequest): Promise<ApiResponse<SendMessageResponse>> => {
    if (USE_MOCK) {
      return mockApi.sendMessage(data);
    }
    return httpClient.post(`/conversations/${data.conversation_id}/messages`, {
      content: data.content,
    });
  },
};
