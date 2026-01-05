import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentApi } from '../api/documentApi';
import type { DocumentFilters, Document } from '../api/documentTypes';

// Query keys - centralized for consistency
export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters: DocumentFilters) => [...documentKeys.lists(), filters] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
};

// Fetch documents with automatic caching
export function useDocuments(filters: DocumentFilters = {}) {
  return useQuery({
    queryKey: documentKeys.list(filters),
    queryFn: () => documentApi.getDocuments(filters),
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch single document
export function useDocument(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => documentApi.getDocument(id),
    enabled: !!id,
  });
}

// Upload mutation with cache invalidation
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: documentApi.uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}

// Delete mutation with optimistic update
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: documentApi.deleteDocument,
    onMutate: async (documentId) => {
      await queryClient.cancelQueries({ queryKey: documentKeys.lists() });

      const previousData = queryClient.getQueriesData({ queryKey: documentKeys.lists() });

      queryClient.setQueriesData(
        { queryKey: documentKeys.lists() },
        (old: { data: Document[] } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((doc) => doc.id !== documentId),
          };
        }
      );

      return { previousData };
    },
    onError: (_err, _documentId, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}
