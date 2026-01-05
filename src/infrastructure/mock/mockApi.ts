import type { ApiResponse, PaginatedResponse } from '@/infrastructure/http/types';
import type { Document } from '@/features/documents/api/documentTypes';
import type { Conversation } from '@/features/conversations/api/conversationTypes';
import type { Message, SendMessageResponse } from '@/features/chat/api/chatTypes';
import {
  mockDocuments,
  mockConversations,
  mockMessages,
  generateId,
} from './mockData';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory state (mutable copies)
let documents = [...mockDocuments];
let conversations = [...mockConversations];
const messages: Record<string, Message[]> = { ...mockMessages };

// Document APIs
export async function getDocuments(search?: string): Promise<PaginatedResponse<Document>> {
  await delay(300);
  let filtered = documents;
  if (search) {
    filtered = documents.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  return {
    code: 200,
    message: 'Success',
    data: filtered,
    meta: {
      total: filtered.length,
      offset: 0,
      limit: 20,
      has_more: false,
    },
    trace_id: generateId('trace'),
  };
}

export async function getDocument(id: string): Promise<ApiResponse<Document>> {
  await delay(200);
  const doc = documents.find((d) => d.id === id);
  if (!doc) {
    throw new Error('Document not found');
  }
  return {
    code: 200,
    message: 'Success',
    data: doc,
    trace_id: generateId('trace'),
  };
}

export async function uploadDocument(file: File): Promise<ApiResponse<Document>> {
  await delay(1000);
  const newDoc: Document = {
    id: generateId('doc'),
    name: file.name,
    size: file.size,
    mime_type: file.type || 'application/octet-stream',
    status: 'processing',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  documents = [newDoc, ...documents];

  // Simulate processing completion
  setTimeout(() => {
    const idx = documents.findIndex((d) => d.id === newDoc.id);
    if (idx !== -1) {
      documents[idx] = { ...documents[idx], status: 'ready' };
    }
  }, 3000);

  return {
    code: 200,
    message: 'Document uploaded successfully',
    data: newDoc,
    trace_id: generateId('trace'),
  };
}

export async function deleteDocument(id: string): Promise<ApiResponse<null>> {
  await delay(300);
  documents = documents.filter((d) => d.id !== id);
  return {
    code: 200,
    message: 'Document deleted',
    data: null,
    trace_id: generateId('trace'),
  };
}

// Conversation APIs
export async function getConversations(): Promise<PaginatedResponse<Conversation>> {
  await delay(300);
  return {
    code: 200,
    message: 'Success',
    data: conversations,
    meta: {
      total: conversations.length,
      offset: 0,
      limit: 20,
      has_more: false,
    },
    trace_id: generateId('trace'),
  };
}

export async function getConversation(id: string): Promise<ApiResponse<Conversation>> {
  await delay(200);
  const conv = conversations.find((c) => c.id === id);
  if (!conv) {
    throw new Error('Conversation not found');
  }
  return {
    code: 200,
    message: 'Success',
    data: conv,
    trace_id: generateId('trace'),
  };
}

export async function createConversation(data: {
  title?: string;
  document_ids: string[];
}): Promise<ApiResponse<Conversation>> {
  await delay(300);
  const newConv: Conversation = {
    id: generateId('conv'),
    title: data.title || 'New Conversation',
    document_ids: data.document_ids,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  conversations = [newConv, ...conversations];
  messages[newConv.id] = [];
  return {
    code: 200,
    message: 'Conversation created',
    data: newConv,
    trace_id: generateId('trace'),
  };
}

export async function deleteConversation(id: string): Promise<ApiResponse<null>> {
  await delay(300);
  conversations = conversations.filter((c) => c.id !== id);
  delete messages[id];
  return {
    code: 200,
    message: 'Conversation deleted',
    data: null,
    trace_id: generateId('trace'),
  };
}

// Chat APIs
export async function getMessages(conversationId: string): Promise<PaginatedResponse<Message>> {
  await delay(300);
  const convMessages = messages[conversationId] || [];
  return {
    code: 200,
    message: 'Success',
    data: convMessages,
    meta: {
      total: convMessages.length,
      offset: 0,
      limit: 100,
      has_more: false,
    },
    trace_id: generateId('trace'),
  };
}

export async function sendMessage(data: {
  conversation_id: string;
  content: string;
}): Promise<ApiResponse<SendMessageResponse>> {
  await delay(800);

  const userMessage: Message = {
    id: generateId('msg'),
    conversation_id: data.conversation_id,
    role: 'user',
    content: data.content,
    created_at: new Date().toISOString(),
  };

  // Generate AI response based on user input
  const aiContent = generateAIResponse(data.content);

  const assistantMessage: Message = {
    id: generateId('msg'),
    conversation_id: data.conversation_id,
    role: 'assistant',
    content: aiContent,
    sources: [
      {
        document_id: 'doc-1',
        document_name: 'Q3 Financial Report.pdf',
        content: 'Relevant content excerpt',
        relevance_score: 0.89,
      },
    ],
    created_at: new Date().toISOString(),
  };

  if (!messages[data.conversation_id]) {
    messages[data.conversation_id] = [];
  }
  messages[data.conversation_id].push(userMessage, assistantMessage);

  return {
    code: 200,
    message: 'Message sent',
    data: {
      user_message: userMessage,
      assistant_message: assistantMessage,
    },
    trace_id: generateId('trace'),
  };
}

function generateAIResponse(userInput: string): string {
  const input = userInput.toLowerCase();

  if (input.includes('hello') || input.includes('hi')) {
    return "Hello! I'm your Document Q&A assistant. I can help you analyze and answer questions about your uploaded documents. What would you like to know?";
  }

  if (input.includes('revenue') || input.includes('financial')) {
    return `Based on the documents, here's the financial summary:

**Key Metrics:**
- Total Revenue: $45.2M (Q3 2023)
- Growth Rate: 18% YoY
- Profit Margin: 15.3%

Would you like me to dive deeper into any specific aspect?`;
  }

  if (input.includes('feature') || input.includes('roadmap')) {
    return `According to the Product Roadmap, the upcoming features include:

1. **AI-powered Analysis** - Q1 2024
2. **Multi-language Support** - Q1 2024
3. **Mobile App** - Q3 2024

Is there a specific feature you'd like more details about?`;
  }

  return `I've analyzed your question: "${userInput}"

Based on the available documents, here's what I found:

This appears to be related to the content in your uploaded documents. To provide a more specific answer, I would need to search through the relevant sections.

Would you like me to:
1. Search for specific keywords?
2. Summarize a particular document?
3. Compare information across documents?`;
}
