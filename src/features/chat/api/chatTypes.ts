export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  created_at: string;
}

export interface Source {
  document_id: string;
  document_name: string;
  content: string;
  relevance_score: number;
}

export interface SendMessageRequest {
  conversation_id: string;
  content: string;
}

export interface SendMessageResponse {
  user_message: Message;
  assistant_message: Message;
}
