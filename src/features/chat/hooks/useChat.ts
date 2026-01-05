import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chatApi';
import type { SendMessageRequest, Message } from '../api/chatTypes';

export const chatKeys = {
  all: ['chat'] as const,
  messages: (conversationId: string) => [...chatKeys.all, 'messages', conversationId] as const,
};

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: chatKeys.messages(conversationId ?? ''),
    queryFn: () => chatApi.getMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 0, // Always fresh for chat
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageRequest) => chatApi.sendMessage(data),
    onMutate: async (variables) => {
      // Optimistic update - add user message immediately
      const queryKey = chatKeys.messages(variables.conversation_id);
      await queryClient.cancelQueries({ queryKey });

      const previousMessages = queryClient.getQueryData(queryKey);

      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: variables.conversation_id,
        role: 'user',
        content: variables.content,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData(queryKey, (old: { data: Message[] } | undefined) => {
        if (!old) return { data: [optimisticMessage], meta: { total: 1, offset: 0, limit: 100, has_more: false } };
        return { ...old, data: [...old.data, optimisticMessage] };
      });

      return { previousMessages };
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(chatKeys.messages(variables.conversation_id), context.previousMessages);
      }
    },
    onSuccess: (response, variables) => {
      // Replace optimistic message with real messages
      queryClient.setQueryData(chatKeys.messages(variables.conversation_id), (old: { data: Message[] } | undefined) => {
        if (!old) return old;
        // Remove temp message and add real ones
        const filtered = old.data.filter((m) => !m.id.startsWith('temp-'));
        return {
          ...old,
          data: [...filtered, response.data.user_message, response.data.assistant_message],
        };
      });
    },
  });
}
