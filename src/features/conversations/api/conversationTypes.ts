export interface Conversation {
  id: string;
  title: string;
  document_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateConversationRequest {
  title?: string;
  document_ids: string[];
}
