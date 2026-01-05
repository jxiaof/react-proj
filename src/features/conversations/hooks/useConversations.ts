import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationApi } from '../api/conversationApi';
import type { CreateConversationRequest } from '../api/conversationTypes';

export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
};

export function useConversations() {
  return useQuery({
    queryKey: conversationKeys.lists(),
    queryFn: conversationApi.getConversations,
    staleTime: 5 * 60 * 1000,
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: conversationKeys.detail(id),
    queryFn: () => conversationApi.getConversation(id),
    enabled: !!id,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConversationRequest) => conversationApi.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: conversationApi.deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}
